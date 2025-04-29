FROM node:18-alpine as build

WORKDIR /app

# Копирование только файлов package.json и package-lock.json клиента
COPY ./client/package*.json ./

# Установка зависимостей
RUN npm install

# Копирование исходного кода клиента
COPY ./client/ .

# Сборка приложения
RUN npm run build

# Этап 2: Настройка Nginx для раздачи статических файлов
FROM nginx:alpine

# Копирование собранных файлов из предыдущего этапа
COPY --from=build /app/dist /usr/share/nginx/html

# Копирование конфигурации Nginx
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf

# Открытие порта
EXPOSE 80

# Запуск Nginx
CMD ["nginx", "-g", "daemon off;"]
