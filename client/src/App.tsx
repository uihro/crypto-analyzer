import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { 
  CssBaseline, 
  ThemeProvider, 
  createTheme, 
  Container, 
  Grid, 
  AppBar, 
  Toolbar, 
  Typography, 
  Box 
} from '@mui/material';
import { AnalysisProvider } from './context/AnalysisContext';
import CoinAnalysisForm from './components/CoinAnalysisForm';
import ReportGenerator from './components/ReportGenerator';
import GoogleAuthCallback from './components/GoogleAuthCallback';
import { useAnalysis } from './context/AnalysisContext';

// Создание темы
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
});

// Главный компонент приложения
const MainApp: React.FC = () => {
  const { 
    allCoins,
    currentAnalysis, 
    accessToken,
    updateAnalysis, 
    saveAnalysis, 
    analysisResults,
    googleAccessToken,
    setSelectedCoin
  } = useAnalysis();

  // Автоматически выбираем первую монету если список загружен
  React.useEffect(() => {
    if (allCoins && allCoins.length > 0) {
      setSelectedCoin(allCoins[0]);
    }
  }, [allCoins, setSelectedCoin]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Анализатор Криптовалют
          </Typography>
          {accessToken && (
            <Typography variant="body2" color="inherit">
              Google авторизован
            </Typography>
          )}
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="md" sx={{ mt: 3, mb: 3 }}>
        <Grid container spacing={2}>
          {/* Форма анализа - теперь всегда отображается */}
          <Grid item xs={12}>
            <CoinAnalysisForm 
              analysis={currentAnalysis} 
              onChange={updateAnalysis} 
              onSave={saveAnalysis} 
            />
          </Grid>
          
          {/* Генерация отчета */}
          <Grid item xs={12}>
            <ReportGenerator
              analyses={analysisResults}
              accessToken={googleAccessToken}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

// Корневой компонент с провайдерами
const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AnalysisProvider>
          <Routes>
            <Route path="/auth-callback" element={<GoogleAuthCallback />} />
            <Route path="/" element={<MainApp />} />
          </Routes>
        </AnalysisProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;
