# api/Dockerfile

FROM php:8.2-fpm-alpine

# Install system dependencies using apk (Alpine Linux package manager)
RUN apk update && apk add --no-cache \
    build-base \
    libpng-dev \
    oniguruma-dev \
    libxml2-dev \
    zip \
    unzip \
    sqlite \
    sqlite-dev \
    curl

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_mysql pdo_sqlite mbstring exif pcntl bcmath gd

# Install Composer from the official Composer image
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy the application code into the container
COPY . /var/www

# Set proper ownership for the application directory
RUN chown -R www-data:www-data /var/www

# Copy the entrypoint script and make it executable
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Expose port 9000 for PHP-FPM
EXPOSE 9000

# Use the entrypoint script to ensure the database exists and run migrations
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]