FROM node:18-alpine

WORKDIR /app

# Копирование package.json и package-lock.json
COPY package*.json ./

# Установка зависимостей
RUN npm install --production

# Копирование исходного кода
COPY . .

# Открытие порта
EXPOSE 3001

# Переменная окружения для продакшена
ENV NODE_ENV=production

# Запуск приложения
CMD ["node", "index.js"]
