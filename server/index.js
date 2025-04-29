const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const path = require('path');

// Загрузка переменных окружения
dotenv.config();

// Инициализация приложения Express
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet()); // Безопасность
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3002'],  // Разрешаем оба порта
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json()); // Парсинг JSON
app.use(express.urlencoded({ extended: true })); // Парсинг URL-encoded данных

// Маршруты API
app.use('/api/coins', require('./routes/coins'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/auth', require('./routes/auth'));

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Внутренняя ошибка сервера',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  console.log(`Режим: ${process.env.NODE_ENV || 'development'}`);
});
