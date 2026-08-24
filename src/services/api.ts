import axios from 'axios';
import { tokenStorage } from '../lib/tokenStorage';

// Variables d'environnement Vite (voir .env.example) — avec repli sur le dev local
// si le fichier .env n'a pas été créé.
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api';
const WEB_URL = import.meta.env.VITE_WEB_URL ?? 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_URL,
});

export const webApi = axios.create({
  baseURL: WEB_URL, // sans /api
});

// Injecte le token Bearer (Sanctum) sur chaque requête.
// Adaptez getToken() à votre store d'auth (contexte, zustand, etc.)
api.interceptors.request.use((config) => {
  // Ne touche pas au header si déjà fourni explicitement (ex: routes /v1/sms/*
  // qui s'authentifient avec une clé API, pas le token Sanctum de session).
  if (!config.headers.Authorization) {
    const token = tokenStorage.get();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Déconnexion propre si le token est invalide/expiré
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const token = tokenStorage.clear();
      // ex: window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);