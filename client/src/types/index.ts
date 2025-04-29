// Типы для криптовалют
export interface Coin {
  id: string;
  symbol: string;
  name: string;
}

// Типы для анализа криптовалют
export interface CoinAnalysis {
  coin: Coin;
  shortPositionNotes: string;
  shortAnalysis: string;
  longPositionNotes: string;
  longAnalysis: string;
}

// Типы для ответов API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  message?: string;
  error?: string;
}

// Типы для авторизации Google
export interface GoogleAuthResponse {
  success: boolean;
  authUrl?: string;
  message?: string;
  error?: string;
}

export interface TokenVerificationResponse {
  success: boolean;
  message: string;
  error?: string;
}

// Типы для отчетов
export interface ReportGenerationResponse {
  success: boolean;
  fileId?: string;
  fileName?: string;
  message?: string;
  error?: string;
}
