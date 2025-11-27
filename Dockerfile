# Imagen base con PHP y extensiones necesarias
FROM php:8.2-fpm

# Instalar utilidades
RUN apt-get update && apt-get install -y \
    git zip unzip curl nodejs npm

# Instalar Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copiar archivos del proyecto
WORKDIR /var/www/html
COPY . .

# Instalar dependencias de PHP
RUN composer install --no-dev --optimize-autoloader

# Instalar dependencias de Node y compilar assets
RUN npm install && npm run build

# Permisos para Laravel
RUN chmod -R 775 storage bootstrap/cache

# Exponer puerto
EXPOSE 8000

# Comando para arrancar Laravel
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
