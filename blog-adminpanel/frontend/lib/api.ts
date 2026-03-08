import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// API URL - change according to your environment
const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('✅ Token added to request');
      }
    } catch (error) {
      console.log('❌ Error getting token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      await AsyncStorage.removeItem('token');
      
      console.log('⚠️ Token expired - please login again');
      
      Alert.alert(
        'Session Expired',
        'Please login again',
        [
          { text: 'OK' }
        ]
      );
    }

    if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
      console.log('🌐 Network error - check your connection');
      Alert.alert('Connection Error', 'Please check your internet connection');
    }

    return Promise.reject(error);
  }
);

export default api;