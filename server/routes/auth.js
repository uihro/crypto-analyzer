const express = require('express');
const router = express.Router();
const { google } = require('googleapis');

// Настройка OAuth2 клиента
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Область доступа для Google Drive API
const SCOPES = [
  'https://www.googleapis.com/auth/drive.file'
];

/**
 * @route   GET /api/auth/google
 * @desc    Получение URL для авторизации Google
 * @access  Public
 */
router.get('/google', (req, res) => {
  try {
    // Генерация URL для авторизации
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline', // Получение refresh_token
      scope: SCOPES,
      prompt: 'consent' // Всегда запрашивать согласие пользователя
    });
    
    res.json({
      success: true,
      authUrl
    });
  } catch (error) {
    console.error('Ошибка при генерации URL для авторизации:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при генерации URL для авторизации',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   GET /api/auth/google/callback
 * @desc    Обработка колбэка от Google OAuth
 * @access  Public
 */
router.get('/google/callback', async (req, res) => {
  const { code } = req.query;
  
  if (!code) {
    return res.status(400).json({
      success: false,
      message: 'Отсутствует код авторизации'
    });
  }
  
  try {
    // Обмен кода на токены
    const { tokens } = await oauth2Client.getToken(code);
    
    // Перенаправление на фронтенд с токенами
    const redirectUrl = `${process.env.CORS_ORIGIN || 'http://localhost:3000'}/auth-callback?access_token=${tokens.access_token}`;
    
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('Ошибка при обмене кода на токены:', error);
    
    // Перенаправление на фронтенд с ошибкой
    const redirectUrl = `${process.env.CORS_ORIGIN || 'http://localhost:3000'}/auth-callback?error=${encodeURIComponent('Ошибка авторизации')}`;
    
    res.redirect(redirectUrl);
  }
});

/**
 * @route   POST /api/auth/verify-token
 * @desc    Проверка токена доступа Google
 * @access  Public
 */
router.post('/verify-token', async (req, res) => {
  const { accessToken } = req.body;
  
  if (!accessToken) {
    return res.status(400).json({
      success: false,
      message: 'Отсутствует токен доступа'
    });
  }
  
  try {
    // Установка токена доступа
    oauth2Client.setCredentials({
      access_token: accessToken
    });
    
    // Проверка токена через запрос к Google Drive API
    const drive = google.drive({ version: 'v3', auth: oauth2Client });
    await drive.about.get({ fields: 'user' });
    
    res.json({
      success: true,
      message: 'Токен действителен'
    });
  } catch (error) {
    console.error('Ошибка при проверке токена:', error);
    res.status(401).json({
      success: false,
      message: 'Недействительный токен доступа',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
