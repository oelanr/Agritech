import { AuthResponse, AuthErrorResponse } from "./types"
import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.88.251:8001/api/'; 

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token && config.headers) {
        config.headers.Authorization = `Token ${token}`;
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