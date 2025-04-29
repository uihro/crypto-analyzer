import React from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Divider,
  LinearProgress
} from '@mui/material';
import { CoinAnalysis } from '../types';
import { useAnalysis } from '../context/AnalysisContext';

interface CoinAnalysisFormProps {
  analysis: Partial<CoinAnalysis>;
  onChange: (field: keyof Omit<CoinAnalysis, 'coin'>, value: string) => void;
  onSave: () => void;
}

const CoinAnalysisForm: React.FC<CoinAnalysisFormProps> = ({ 
  analysis, 
  onChange, 
  onSave 
}) => {
  const { selectedCoin, isLoading, currentCoinIndex, totalCoins } = useAnalysis();
  
  if (isLoading) {
    return (
      <Box my={2}>
        <Typography variant="body1" color="textSecondary" align="center" gutterBottom>
          Загрузка данных...
        </Typography>
        <LinearProgress />
      </Box>
    );
  }

  if (!selectedCoin) {
    return (
      <Box my={2}>
        <Typography variant="body1" color="textSecondary" align="center">
          Монеты не найдены
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
    <Paper elevation={2} sx={{ p: 2 }}>
      <form onSubmit={handleSubmit}>
        <Box mb={1}>
          <Typography variant="h6" component="h2" gutterBottom>
            Анализ {selectedCoin.name} ({selectedCoin.symbol.toUpperCase()})
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
        
        <Box mb={2}>
          <Typography variant="subtitle1" gutterBottom>
            Шорт-позиция
          </Typography>
          <TextField
            label="Заметки для шорт-позиции"
            fullWidth
            value={analysis.shortPositionNotes || ''}
            onChange={handleChange('shortPositionNotes')}
            variant="outlined"
            margin="dense"
            size="small"
          />
          <TextField
            label="Анализ для шорт-позиции"
            fullWidth
            multiline
            rows={2}
            value={analysis.shortAnalysis || ''}
            onChange={handleChange('shortAnalysis')}
            variant="outlined"
            margin="dense"
            size="small"
          />
        </Box>
        
        <Divider sx={{ my: 1 }} />
        
        <Box mb={2}>
          <Typography variant="subtitle1" gutterBottom>
            Лонг-позиция
          </Typography>
          <TextField
            label="Заметки для лонг-позиции"
            fullWidth
            value={analysis.longPositionNotes || ''}
            onChange={handleChange('longPositionNotes')}
            variant="outlined"
            margin="dense"
            size="small"
          />
          <TextField
            label="Анализ для лонг-позиции"
            fullWidth
            multiline
            rows={2}
            value={analysis.longAnalysis || ''}
            onChange={handleChange('longAnalysis')}
            variant="outlined"
            margin="dense"
            size="small"
          />
        </Box>
        
        <Box display="flex" justifyContent="flex-end">
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            size="medium"
          >
            Сохранить и перейти к следующей
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default CoinAnalysisForm;
