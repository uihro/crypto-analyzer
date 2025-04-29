import React, { useContext, useState, useEffect } from 'react';
import { Coin, CoinAnalysis } from '../types';
import { fetchCoins } from '../services/api';

interface AnalysisContextType {
  analyses: CoinAnalysis[];
  selectedCoin: Coin | null;
  currentAnalysis: Partial<CoinAnalysis>;
  accessToken: string | null;
  setSelectedCoin: (coin: Coin | null) => void;
  updateAnalysis: (field: keyof Omit<CoinAnalysis, 'coin'>, value: string) => void;
  saveAnalysis: () => void;
  setAccessToken: (token: string | null) => void;
  analysisResults: CoinAnalysis[];
  googleAccessToken: string | null;
  currentCoinIndex: number;
  totalCoins: number;
  allCoins: Coin[];
  moveToNextCoin: () => void;
  moveToPreviousCoin: () => void;
  isLoading: boolean;
}

export const AnalysisContext = React.createContext<AnalysisContextType | undefined>(undefined);

export const useAnalysis = (): AnalysisContextType => {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
};

interface AnalysisProviderProps {
  children: React.ReactNode;
}

export const AnalysisProvider: React.FC<AnalysisProviderProps> = ({ children }) => {
  const [analyses, setAnalyses] = useState<CoinAnalysis[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<Partial<CoinAnalysis>>({});
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [currentCoinIndex, setCurrentCoinIndex] = useState<number>(0);
  const [allCoins, setAllCoins] = useState<Coin[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Загрузка списка монет при инициализации
  useEffect(() => {
    const loadCoins = async () => {
      try {
        setIsLoading(true);
        const coins = await fetchCoins();
        setAllCoins(coins);
        
        // Установка первой монеты как выбранной при загрузке
        if (coins.length > 0) {
          setSelectedCoin(coins[0]);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading coins:', error);
        setIsLoading(false);
      }
    };
    
    loadCoins();
  }, []);

  // Загрузка данных из localStorage при инициализации
  useEffect(() => {
    const savedAnalyses = localStorage.getItem('cryptoAnalyses');
    if (savedAnalyses) {
      try {
        setAnalyses(JSON.parse(savedAnalyses));
      } catch (error) {
        console.error('Error parsing saved analyses:', error);
      }
    }

    const savedToken = localStorage.getItem('googleAccessToken');
    if (savedToken) {
      setAccessToken(savedToken);
    }
  }, []);

  // Сохранение данных в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('cryptoAnalyses', JSON.stringify(analyses));
  }, [analyses]);

  useEffect(() => {
    if (accessToken) {
      localStorage.setItem('googleAccessToken', accessToken);
    } else {
      localStorage.removeItem('googleAccessToken');
    }
  }, [accessToken]);

  // Загрузка текущего анализа при выборе монеты
  useEffect(() => {
    if (selectedCoin) {
      const existingAnalysis = analyses.find(a => a.coin.id === selectedCoin.id);
      if (existingAnalysis) {
        setCurrentAnalysis({
          shortPositionNotes: existingAnalysis.shortPositionNotes,
          shortAnalysis: existingAnalysis.shortAnalysis,
          longPositionNotes: existingAnalysis.longPositionNotes,
          longAnalysis: existingAnalysis.longAnalysis
        });
      } else {
        setCurrentAnalysis({
          shortPositionNotes: '',
          shortAnalysis: '',
          longPositionNotes: '',
          longAnalysis: ''
        });
      }
    } else {
      setCurrentAnalysis({});
    }
  }, [selectedCoin, analyses]);

  const updateAnalysis = (field: keyof Omit<CoinAnalysis, 'coin'>, value: string) => {
    setCurrentAnalysis(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveAnalysis = () => {
    if (!selectedCoin) return;

    const newAnalysis: CoinAnalysis = {
      coin: selectedCoin,
      shortPositionNotes: currentAnalysis.shortPositionNotes || '',
      shortAnalysis: currentAnalysis.shortAnalysis || '',
      longPositionNotes: currentAnalysis.longPositionNotes || '',
      longAnalysis: currentAnalysis.longAnalysis || ''
    };

    setAnalyses(prev => {
      const index = prev.findIndex(a => a.coin.id === selectedCoin.id);
      if (index >= 0) {
        // Обновление существующего анализа
        const updated = [...prev];
        updated[index] = newAnalysis;
        return updated;
      } else {
        // Добавление нового анализа
        return [...prev, newAnalysis];
      }
    });
    
    // Переход к следующей монете после сохранения (по нажатию кнопки)
    moveToNextCoin();
  };
  
  // Переход к следующей монете
  const moveToNextCoin = () => {
    if (currentCoinIndex < allCoins.length - 1) {
      const nextIndex = currentCoinIndex + 1;
      setCurrentCoinIndex(nextIndex);
      setSelectedCoin(allCoins[nextIndex]);
    }
  };
  
  // Переход к предыдущей монете
  const moveToPreviousCoin = () => {
    if (currentCoinIndex > 0) {
      const prevIndex = currentCoinIndex - 1;
      setCurrentCoinIndex(prevIndex);
      setSelectedCoin(allCoins[prevIndex]);
    }
  };
  
  // Обновление индекса при изменении выбранной монеты
  useEffect(() => {
    if (selectedCoin && allCoins.length > 0) {
      const index = allCoins.findIndex(coin => coin.id === selectedCoin.id);
      if (index !== -1) {
        setCurrentCoinIndex(index);
      }
    }
  }, [selectedCoin, allCoins]);

  const value: AnalysisContextType = {
    analyses,
    selectedCoin,
    currentAnalysis,
    accessToken,
    setSelectedCoin,
    updateAnalysis,
    saveAnalysis,
    setAccessToken,
    analysisResults: analyses,
    googleAccessToken: accessToken,
    currentCoinIndex,
    totalCoins: allCoins.length,
    allCoins,
    moveToNextCoin,
    moveToPreviousCoin,
    isLoading
  };

  return (
    <AnalysisContext.Provider value={value}>
      {children}
    </AnalysisContext.Provider>
  );
};
