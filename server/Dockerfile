FROM node:18-alpine

WORKDIR /app

# Копирование package.json и package-lock.json
COPY package*.json ./

# Установка зависимостей
RUN npm install --production

# Копирование исходного кода
COPY . .

# Проверка наличия файла index.js (для отладки)
RUN ls -la

# Открытие порта
EXPOSE 3001

# Переменная окружения для продакшена
ENV NODE_ENV=production

# Запуск приложения с явным указанием пути
CMD ["node", "./index.js"]
