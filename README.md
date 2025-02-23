# Prerequisites
## Ensure you have the following installed on your system
- Node.js (v20.17.0 or later)
- PHP (Version PHP 8.4.3 or later)
- SQLite
- Composer (2.8.5 For managing PHP dependencies)


## Environment Variables
- Frontend: Rename .env.example to .env.local and update the values.
- Backend: Rename .env.example to .env and configure database settings.


## Setting Up the Frontend (Next.js)
- Node.js v20.17.0 or later.

### Navigate to the frontend directory
- cd client

### Install dependencies
- yarn

### Start the development server
- yarn dev

### Open your browser and visit
- http://localhost:3000


### Navigate to the api directory
- cd api

### Install PHP dependencies
- composer install

<!-- ## Ensure the SQLite database file exists
- touch database.sqlite -->


### Run database migrations 
- php artisan migrate

### Start the PHP built-in server
- php -S localhost:8000 -t public

### The backend should now be running at
- http://localhost:8000



## Run via docker-compose

### Environment Variables
- Frontend: Rename .env.example to .env.local and update the values.
- Backend: Rename .env.example to .env and configure database settings.

### Run the application
- docker-compose up -d