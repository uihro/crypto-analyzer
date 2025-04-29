const express = require('express');
const router = express.Router();
const Papa = require('papaparse');
const { google } = require('googleapis');

/**
 * @route   POST /api/reports/generate
 * @desc    Генерация отчета в формате CSV
 * @access  Private
 */
router.post('/generate', (req, res) => {
  try {
    const { data } = req.body;
    
    if (!data || !Array.isArray(data) || data.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Необходимо предоставить массив данных для генерации отчета'
      });
    }
    
    // Подготовка данных для CSV
    const csvData = data.map(item => ({
      coin: item.coin.name || item.coin.symbol || item.coin.id || 'Неизвестная монета',
      shortPositionNotes: item.shortPositionNotes || '',
      shortAnalysis: item.shortAnalysis || '',
      longPositionNotes: item.longPositionNotes || '',
      longAnalysis: item.longAnalysis || ''
    }));
    
    // Генерация CSV
    const csv = Papa.unparse({
      fields: ['coin', 'shortPositionNotes', 'shortAnalysis', 'longPositionNotes', 'longAnalysis'],
      data: csvData
    });
    
    // Отправка CSV клиенту
    const formattedDate = new Date().toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${formattedDate}.csv"`);
    res.status(200).send(csv);
  } catch (error) {
    console.error('Ошибка при генерации отчета:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при генерации отчета',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});


/**
 * @route   POST /api/reports/upload-to-drive
 * @desc    Загрузка отчета на Google Drive
 * @access  Private
 */
router.post('/upload-to-drive', async (req, res) => {
  try {
    const { data, accessToken } = req.body;
    
    if (!data || !Array.isArray(data) || data.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Необходимо предоставить массив данных для генерации отчета'
      });
    }
    
    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: 'Необходимо предоставить токен доступа Google'
      });
    }
    
    // Подготовка данных для CSV
    const csvData = data.map(item => ({
      coin: item.coin.name || item.coin.symbol || item.coin.id || 'Неизвестная монета',
      shortPositionNotes: item.shortPositionNotes || '',
      shortAnalysis: item.shortAnalysis || '',
      longPositionNotes: item.longPositionNotes || '',
      longAnalysis: item.longAnalysis || ''
    }));
    
    // Генерация CSV
    const csv = Papa.unparse({
      fields: ['coin', 'shortPositionNotes', 'shortAnalysis', 'longPositionNotes', 'longAnalysis'],
      data: csvData
    });
    
    // Настройка OAuth2 клиента
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    
    // Установка токена доступа
    oauth2Client.setCredentials({
      access_token: accessToken
    });
    
    // Инициализация Google Drive API
    const drive = google.drive({ version: 'v3', auth: oauth2Client });
    
    // Загрузка файла на Google Drive
    const formattedDate = new Date().toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
    
    const fileName = `${formattedDate}.csv`;
    
    const response = await drive.files.create({
      requestBody: {
        name: fileName,
        mimeType: 'text/csv'
      },
      media: {
        mimeType: 'text/csv',
        body: csv
      }
    });
    
    res.json({
      success: true,
      message: 'Отчет успешно загружен на Google Drive',
      fileId: response.data.id,
      fileName: response.data.name
    });
  } catch (error) {
    console.error('Ошибка при загрузке отчета на Google Drive:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при загрузке отчета на Google Drive',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
