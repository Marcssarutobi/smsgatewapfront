import axios from 'axios';
import { tokenStorage } from '../lib/tokenStorage';

export const api = axios.create({
  baseURL:'http://localhost:8000/api',
});

export const webApi = axios.create({
  baseURL: 'http://localhost:8000', // sans /api
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