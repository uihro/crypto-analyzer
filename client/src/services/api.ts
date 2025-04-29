import axios from 'axios';
import { Coin, CoinAnalysis, ApiResponse, GoogleAuthResponse, TokenVerificationResponse, ReportGenerationResponse } from '../types';

// Базовый URL API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Создание экземпляра axios с базовым URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Получение списка криптовалют
export const fetchCoins = async (): Promise<Coin[]> => {
  try {
    const response = await api.get<ApiResponse<Coin[]>>('/coins');
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Ошибка при получении списка криптовалют');
    }
    
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching coins:', error);
    throw error;
  }
};

// Получение информации о конкретной криптовалюте
export const fetchCoin = async (id: string): Promise<Coin> => {
  try {
    const response = await api.get<ApiResponse<Coin>>(`/coins/${id}`);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Ошибка при получении информации о криптовалюте');
    }
    
    return response.data.data as Coin;
  } catch (error) {
    console.error(`Error fetching coin ${id}:`, error);
    throw error;
  }
};

// Генерация отчета
export const generateReport = async (data: CoinAnalysis[]): Promise<void> => {
  try {
    // Используем прямой подход - получаем текущую дату и форматируем ее на клиенте
    const today = new Date();
    const formattedDate = `${today.getDate().toString().padStart(2, '0')}.${(today.getMonth() + 1).toString().padStart(2, '0')}.${(today.getFullYear() % 100).toString().padStart(2, '0')}`;
    const filename = `${formattedDate}.csv`;
    
    const response = await api.post('/reports/generate', { data }, {
      responseType: 'blob'
    });
    
    // Создание ссылки для скачивания файла
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
};

// Получение URL для авторизации Google
export const getGoogleAuthUrl = async (): Promise<string> => {
  try {
    const response = await api.get<GoogleAuthResponse>('/auth/google');
    
    if (!response.data.success || !response.data.authUrl) {
      throw new Error(response.data.message || 'Ошибка при получении URL для авторизации');
    }
    
    return response.data.authUrl;
  } catch (error) {
    console.error('Error getting Google auth URL:', error);
    throw error;
  }
};

// Проверка токена доступа Google
export const verifyGoogleToken = async (accessToken: string): Promise<boolean> => {
  try {
    const response = await api.post<TokenVerificationResponse>('/auth/verify-token', { accessToken });
    
    return response.data.success;
  } catch (error) {
    console.error('Error verifying Google token:', error);
    return false;
  }
};

// Загрузка отчета на Google Drive
export const uploadReportToDrive = async (data: CoinAnalysis[], accessToken: string): Promise<ReportGenerationResponse> => {
  try {
    const response = await api.post<ReportGenerationResponse>('/reports/upload-to-drive', { 
      data,
      accessToken
    });
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Ошибка при загрузке отчета на Google Drive');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error uploading report to Google Drive:', error);
    throw error;
  }
};

export default api;
