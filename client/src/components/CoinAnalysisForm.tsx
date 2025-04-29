import React from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Grid,
  Divider,
  LinearProgress
} from '@mui/material';
import { Coin, CoinAnalysis } from '../types';
import { useAnalysis } from '../context/AnalysisContext';

interface CoinAnalysisFormProps {
  coin: Coin | null;
  analysis: Partial<CoinAnalysis>;
  onChange: (field: keyof Omit<CoinAnalysis, 'coin'>, value: string) => void;
  onSave: () => void;
}

const CoinAnalysisForm: React.FC<CoinAnalysisFormProps> = ({ 
  coin, 
  analysis, 
  onChange, 
  onSave 
}) => {
  const { currentCoinIndex, totalCoins, isLoading } = useAnalysis();
  
  if (isLoading) {
    return (
      <Box my={4}>
        <Typography variant="body1" color="textSecondary" align="center" gutterBottom>
          Загрузка списка криптовалют...
        </Typography>
        <LinearProgress />
      </Box>
    );
  }
  
  if (!coin) {
    return (
      <Box my={2}>
        <Typography variant="body1" color="textSecondary" align="center">
          Выберите криптовалюту из списка для анализа
        </Typography>
      </Box>
    );
  }

  const handleChange = (field: keyof Omit<CoinAnalysis, 'coin'>) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onChange(field, event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSave();
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mt: 2 }}>
      <form onSubmit={handleSubmit}>
        <Box mb={2}>
          <Typography variant="h5" component="h2" gutterBottom>
            Анализ {coin.name} ({coin.symbol.toUpperCase()})
          </Typography>
          <Box display="flex" alignItems="center" mb={1}>
            <Typography variant="body2" color="textSecondary">
              Монета {currentCoinIndex + 1} из {totalCoins}
            </Typography>
            <Box sx={{ width: '100%', ml: 2 }}>
              <LinearProgress 
                variant="determinate" 
                value={(currentCoinIndex / (totalCoins - 1)) * 100} 
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
          </Box>
        </Box>
        
        <Box my={3}>
          <Typography variant="h6" gutterBottom>
            Шорт-позиция
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Краткое название/заметки для шорт-позиции"
                fullWidth
                value={analysis.shortPositionNotes || ''}
                onChange={handleChange('shortPositionNotes')}
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Анализ для шорт-позиции"
                fullWidth
                multiline
                rows={4}
                value={analysis.shortAnalysis || ''}
                onChange={handleChange('shortAnalysis')}
                variant="outlined"
                margin="normal"
              />
            </Grid>
          </Grid>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Box my={3}>
          <Typography variant="h6" gutterBottom>
            Лонг-позиция
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Краткое название/заметки для лонг-позиции"
                fullWidth
                value={analysis.longPositionNotes || ''}
                onChange={handleChange('longPositionNotes')}
                variant="outlined"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Анализ для лонг-позиции"
                fullWidth
                multiline
                rows={4}
                value={analysis.longAnalysis || ''}
                onChange={handleChange('longAnalysis')}
                variant="outlined"
                margin="normal"
              />
            </Grid>
          </Grid>
        </Box>
        
        <Box mt={4} display="flex" justifyContent="flex-end">
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            size="large"
          >
            Сохранить анализ
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default CoinAnalysisForm;
