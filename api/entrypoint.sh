#!/bin/sh

# entrypoint.sh

echo "Checking if SQLite database file exists..."

DB_FILE="./database/database.sqlite"

if [ ! -f "$DB_FILE" ]; then
    echo "Database file not found. Creating..."
    mkdir -p /var/www/database
    touch "$DB_FILE"
    chown -R www-data:www-data /var/www/database
else
    echo "Database file already exists."
fi

echo "Running migrations..."
php artisan migrate --force

echo "Starting PHP-FPM..."
exec php-fpm