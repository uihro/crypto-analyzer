FROM node:18-alpine

WORKDIR /app

# Копирование только содержимого папки server
COPY ./server/package*.json ./

# Установка зависимостей
RUN npm install --production

# Копирование исходного кода сервера
COPY ./server/ .

# Проверка наличия файла index.js (для отладки)
RUN ls -la

# Открытие порта
EXPOSE 3001

# Переменная окружения для продакшена
ENV NODE_ENV=production

# Запуск приложения с явным указанием пути
CMD ["node", "index.js"]
