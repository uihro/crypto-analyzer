import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper,
  Alert,
  Snackbar,
  CircularProgress,
  Stack
} from '@mui/material';
import { CoinAnalysis } from '../types';
import { generateReport, uploadReportToDrive, getGoogleAuthUrl } from '../services/api';

interface ReportGeneratorProps {
  analyses: CoinAnalysis[];
  accessToken: string | null;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ 
  analyses, 
  accessToken
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleGenerateReport = async () => {
    if (analyses.length === 0) {
      setError('Нет данных для генерации отчета. Добавьте анализ хотя бы для одной криптовалюты.');
      return;
    }

    try {
      setLoading(true);
      await generateReport(analyses);
      setSuccess('Отчет успешно сгенерирован и скачан');
      setError(null);
    } catch (err) {
      setError('Ошибка при генерации отчета');
      console.error('Error generating report:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadToDrive = async () => {
    if (analyses.length === 0) {
      setError('Нет данных для загрузки на Google Drive. Добавьте анализ хотя бы для одной криптовалюты.');
      return;
    }

    if (!accessToken) {
      try {
        const authUrl = await getGoogleAuthUrl();
        window.location.href = authUrl;
      } catch (err) {
        setError('Ошибка при получении URL для авторизации Google');
        console.error('Error getting Google auth URL:', err);
      }
      return;
    }

    try {
      setLoading(true);
      const result = await uploadReportToDrive(analyses, accessToken);
      setSuccess(`Отчет успешно загружен на Google Drive: ${result.fileName}`);
      setError(null);
    } catch (err) {
      setError('Ошибка при загрузке отчета на Google Drive');
      console.error('Error uploading report to Google Drive:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccess(null);
    setError(null);
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Генерация отчета
      </Typography>
      
      <Typography variant="body1" paragraph>
        Вы можете сгенерировать отчет в формате CSV на основе введенных данных и скачать его или загрузить на Google Drive.
      </Typography>
      
      <Box mt={3}>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Количество проанализированных монет: {analyses.length}
        </Typography>
      </Box>
      
      <Stack direction="row" spacing={2} mt={3}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleGenerateReport}
          disabled={loading || analyses.length === 0}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          Скачать отчет
        </Button>
        
        <Button
          variant="contained"
          color="secondary"
          onClick={handleUploadToDrive}
          disabled={loading || analyses.length === 0}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {accessToken ? 'Загрузить на Google Drive' : 'Авторизоваться в Google'}
        </Button>
      </Stack>
      
      <Snackbar 
        open={!!success} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
      
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default ReportGenerator;
