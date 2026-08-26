import { useMemo, useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

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

export function WorldVisitorsMap({ data }: { data: CountryVisitor[] }) {
  const [hovered, setHovered] = useState<{ name: string; count: number } | null>(null);

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

  return (
    <div className="relative">
      <ComposableMap
        projectionConfig={{ scale: 118 }}
        style={{ width: '100%', height: 'auto' }}
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
      </ComposableMap>

      {hovered && (
        <div className="pointer-events-none absolute left-1/2 top-2 -translate-x-1/2 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white shadow-lg">
          {hovered.name} — {hovered.count.toLocaleString('fr-FR')} visiteur{hovered.count > 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
