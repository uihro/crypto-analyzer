import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { useAnalysis } from '../context/AnalysisContext';
import { verifyGoogleToken } from '../services/api';

const GoogleAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { setAccessToken } = useAnalysis();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processAuth = async () => {
      try {
        // Получение токена из URL
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get('access_token');
        const errorMessage = urlParams.get('error');

        if (errorMessage) {
          setError(decodeURIComponent(errorMessage));
          setLoading(false);
          return;
        }

        if (!accessToken) {
          setError('Токен доступа не получен');
          setLoading(false);
          return;
        }

        // Проверка токена
        const isValid = await verifyGoogleToken(accessToken);
        
        if (!isValid) {
          setError('Недействительный токен доступа');
          setLoading(false);
          return;
        }

        // Сохранение токена
        setAccessToken(accessToken);
        
        // Перенаправление на главную страницу
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } catch (err) {
        console.error('Error processing Google auth callback:', err);
        setError('Ошибка при обработке авторизации Google');
        setLoading(false);
      }
    };

    processAuth();
  }, [navigate, setAccessToken]);

  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center" 
      minHeight="100vh"
      p={3}
    >
      {loading ? (
        <>
          <CircularProgress size={60} />
          <Typography variant="h6" mt={3}>
            Обработка авторизации Google...
          </Typography>
        </>
      ) : error ? (
        <Alert severity="error" sx={{ maxWidth: 500 }}>
          <Typography variant="body1">
            Ошибка авторизации: {error}
          </Typography>
          <Typography variant="body2" mt={2}>
            Вы будете перенаправлены на главную страницу через 5 секунд.
          </Typography>
        </Alert>
      ) : (
        <Alert severity="success" sx={{ maxWidth: 500 }}>
          <Typography variant="body1">
            Авторизация успешна! Вы будете перенаправлены на главную страницу.
          </Typography>
        </Alert>
      )}
    </Box>
  );
};

export default GoogleAuthCallback;
