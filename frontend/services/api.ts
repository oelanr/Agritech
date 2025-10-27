import { AuthResponse, AuthErrorResponse } from "./types";
import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// URL de ton backend FastAPI
const API_BASE_URL = 'http://192.168.88.247:8001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT à chaque requête
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`; // FastAPI JWT standard
      }
    } catch (error) {
      console.error("Failed to get token from storage", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
