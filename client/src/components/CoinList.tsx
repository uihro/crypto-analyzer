import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText, 
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import { Coin } from '../types';
import { fetchCoins } from '../services/api';

interface CoinListProps {
  onSelectCoin: (coin: Coin) => void;
  selectedCoinId: string | null;
}

const CoinList: React.FC<CoinListProps> = ({ onSelectCoin, selectedCoinId }) => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getCoins = async () => {
      try {
        setLoading(true);
        const data = await fetchCoins();
        setCoins(data);
        setError(null);
      } catch (err) {
        setError('Ошибка при загрузке списка криптовалют');
        console.error('Error fetching coins:', err);
      } finally {
        setLoading(false);
      }
    };

    getCoins();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box my={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" component="h2" gutterBottom>
        Список криптовалют
      </Typography>
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {coins.map((coin) => (
          <React.Fragment key={coin.id}>
            <ListItem disablePadding>
              <ListItemButton 
                selected={selectedCoinId === coin.id}
                onClick={() => onSelectCoin(coin)}
              >
                <ListItemText 
                  primary={coin.name} 
                  secondary={coin.symbol.toUpperCase()} 
                />
              </ListItemButton>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default CoinList;
