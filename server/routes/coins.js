const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
require('dotenv').config();

/**
 * @route   GET /api/coins
 * @desc    Получить список криптовалют
 * @access  Public
 */
router.get('/', (req, res) => {
  try {
    // Получение списка криптовалют из переменной окружения
    const cryptoList = process.env.CRYPTO_LIST || '';
    const cryptoSymbols = cryptoList.split(',').filter(symbol => symbol.trim() !== '');
    
    // Формирование массива объектов с данными о криптовалютах
    const coins = cryptoSymbols.map((symbol, index) => {
      return {
        id: symbol.toLowerCase(),
        symbol: symbol.toLowerCase(),
        name: symbol.toUpperCase()
      };
    });
    
    res.json({
      success: true,
      count: coins.length,
      data: coins
    });
  } catch (error) {
    console.error('Ошибка при получении списка монет:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении списка монет',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   GET /api/coins/:id
 * @desc    Получить информацию о конкретной криптовалюте
 * @access  Public
 */
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    // Получение списка криптовалют из переменной окружения
    const cryptoList = process.env.CRYPTO_LIST || '';
    const cryptoSymbols = cryptoList.split(',').filter(symbol => symbol.trim() !== '');
    
    // Поиск монеты по id (который соответствует символу в нижнем регистре)
    const symbol = cryptoSymbols.find(s => s.toLowerCase() === id);
    
    if (!symbol) {
      return res.status(404).json({
        success: false,
        message: `Монета с id ${id} не найдена`
      });
    }
    
    const coin = {
      id: symbol.toLowerCase(),
      symbol: symbol.toLowerCase(),
      name: symbol.toUpperCase()
    };
    
    res.json({
      success: true,
      data: coin
    });
  } catch (error) {
    console.error(`Ошибка при получении информации о монете:`, error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении информации о монете',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
