import { useMemo, useState } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

// Topojson du monde chargé depuis un CDN standard (pas de gros fichier
// géographique à maintenir/committer nous-mêmes — pattern habituel de
// react-simple-maps).
const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

type CountryVisitor = { country: string; active_users: number };

// GA4 et le jeu de données topojson n'utilisent pas toujours exactement les
// mêmes noms de pays (ex: GA4 dit "United States", le fond de carte dit
// parfois "United States of America"). Cette table couvre les cas les plus
// fréquents ; le matching se fait de toute façon en minuscules/sans accents
// pour limiter les faux négatifs.
const COUNTRY_NAME_ALIASES: Record<string, string> = {
  'united states': 'united states of america',
  'ivory coast': "cote d'ivoire",
  "côte d'ivoire": "cote d'ivoire",
  'russia': 'russian federation',
  'south korea': 'korea, republic of',
  'north korea': "korea, dem. people's rep. of",
  'democratic republic of congo': 'dem. rep. congo',
  'congo - kinshasa': 'dem. rep. congo',
  'congo - brazzaville': 'congo',
  'tanzania': 'united republic of tanzania',
  'czechia': 'czech republic',
  'laos': 'lao pdr',
};

function normalizeName(name: string): string {
  const lower = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // retire les accents
  return COUNTRY_NAME_ALIASES[lower] ?? lower;
}

// Centre et zoom par défaut, réutilisés pour le bouton "Réinitialiser la vue".
const DEFAULT_CENTER: [number, number] = [10, 15];
const DEFAULT_ZOOM = 1;
const MIN_ZOOM = 1;
const MAX_ZOOM = 8;
// Facteur appliqué à chaque clic sur +/- (zoom multiplicatif, cohérent avec
// le ressenti de la molette).
const ZOOM_STEP_FACTOR = 1.5;

type MapPosition = { coordinates: [number, number]; zoom: number };

export function WorldVisitorsMap({ data }: { data: CountryVisitor[] }) {
  const [hovered, setHovered] = useState<{ name: string; count: number } | null>(null);
  const [position, setPosition] = useState<MapPosition>({
    coordinates: DEFAULT_CENTER,
    zoom: DEFAULT_ZOOM,
  });

  const visitorsByCountry = useMemo(() => {
    const map = new Map<string, number>();
    data.forEach((row) => map.set(normalizeName(row.country), row.active_users));
    return map;
  }, [data]);

  const maxVisitors = useMemo(
    () => Math.max(1, ...data.map((d) => d.active_users)),
    [data]
  );

  const colorFor = (count: number | undefined) => {
    if (!count) return '#f1f5f9'; // pays sans visiteur : gris très clair
    const intensity = Math.min(1, count / maxVisitors);
    // Dégradé du indigo clair au indigo foncé selon l'intensité
    const lightness = 90 - intensity * 55;
    return `hsl(243, 75%, ${lightness}%)`;
  };

  const handleMoveEnd = (pos: MapPosition) => setPosition(pos);

  const handleZoomIn = () =>
    setPosition((pos) => ({ ...pos, zoom: Math.min(pos.zoom * ZOOM_STEP_FACTOR, MAX_ZOOM) }));

  const handleZoomOut = () =>
    setPosition((pos) => ({ ...pos, zoom: Math.max(pos.zoom / ZOOM_STEP_FACTOR, MIN_ZOOM) }));

  const handleReset = () => setPosition({ coordinates: DEFAULT_CENTER, zoom: DEFAULT_ZOOM });

  return (
    <div className="relative w-full h-[420px] sm:h-[480px] lg:h-[560px] overflow-hidden rounded-xl bg-slate-50 touch-none">
      <ComposableMap
        projectionConfig={{ scale: 140 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ZoomableGroup
          center={position.coordinates}
          zoom={position.zoom}
          minZoom={MIN_ZOOM}
          maxZoom={MAX_ZOOM}
          onMoveEnd={handleMoveEnd}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const geoName = normalizeName(geo.properties.name ?? '');
                const count = visitorsByCountry.get(geoName);

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => {
                      if (count) setHovered({ name: geo.properties.name, count });
                    }}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      default: { fill: colorFor(count), stroke: '#e2e8f0', strokeWidth: 0.5, outline: 'none' },
                      hover: { fill: count ? '#4f46e5' : '#f1f5f9', stroke: '#e2e8f0', strokeWidth: 0.5, outline: 'none' },
                      pressed: { outline: 'none' },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {/* Contrôles de zoom/réinitialisation — toujours visibles, en haut à droite */}
      <div className="absolute right-3 top-3 flex flex-col gap-1.5">
        <button
          type="button"
          onClick={handleZoomIn}
          disabled={position.zoom >= MAX_ZOOM}
          aria-label="Zoomer"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          disabled={position.zoom <= MIN_ZOOM}
          aria-label="Dézoomer"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={handleReset}
          aria-label="Réinitialiser la vue"
          title="Réinitialiser la vue"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      {hovered && (
        <div className="pointer-events-none absolute left-1/2 top-2 -translate-x-1/2 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white shadow-lg">
          {hovered.name} — {hovered.count.toLocaleString('fr-FR')} visiteur{hovered.count > 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
