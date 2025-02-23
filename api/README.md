
# News Feed API

This project is a Laravel-based API that aggregates news articles from multiple sources and provides personalized news feeds. Users can register, authenticate, search and filter articles, and customize their feed by setting preferences for preferred sources, categories, and authors.

## Table of Contents

- [Overview](#overview)
- [Architecture and Design](#architecture-and-design)
  - [Application Layers and Responsibilities](#application-layers-and-responsibilities)
  - [Domain Models and Relationships](#domain-models-and-relationships)
  - [Shared Logic, Traits, and Services](#shared-logic-traits-and-services)
  - [Background Jobs and Scraping](#background-jobs-and-scraping)
  - [User Preferences](#user-preferences)
- [Installation and Setup](#installation-and-setup)
- [API Endpoints](#api-endpoints)
- [Executing Jobs via API Route](#executing-jobs-via-api-route)
- [Design Considerations and Best Practices](#design-considerations-and-best-practices)

## Overview

The News Feed API is designed to provide a flexible and scalable platform to serve personalized news feeds. The API aggregates data from multiple news sources (NewsAPI, The Guardian, NYTimes), stores articles with rich metadata, and allows users to manage their preferences for content filtering.

## Architecture and Design

### Application Layers and Responsibilities

- **Controllers:**
  - Handle HTTP requests and responses.
  - Delegate business logic to services.
  - Examples: `AuthController`, `ArticleController`, `UserPreferenceController`.

- **Services:**
  - Encapsulate business and query logic.
  - Example: `ArticleService` builds complex queries (including search, filtering, and pagination).

- **Models:**
  - Represent domain entities such as User, Article, Source, Category, and Author.
  - Define Eloquent relationships (e.g., an Article belongs to a Source, Category, and Author).

- **Jobs:**
  - Perform background tasks such as scraping news articles from external APIs.
  - Examples: `ScrapeNewsAPIJob`, `ScrapeGuardianJob`, `ScrapeNYTimesJob` are responsible for fetching data, processing it, and updating the database.

- **Routes:**
  - Define public and protected API endpoints.
  - Endpoints include authentication, articles, user preferences, and reference data (categories, sources, authors).

### Domain Models and Relationships

- **Article:**
  - Fields: title, description, content, url, published_at, data_source, etc.
  - Relationships:
    - Belongs to a Source
    - Belongs to a Category
    - Belongs to an Author

- **Source, Category, Author:**
  - Each has a `name` attribute and may include additional metadata.
  - These models help categorize and identify articles.

- **UserPreference:**
  - Stores a user’s preferences (e.g., arrays of source_ids, category_ids, author_ids).
  - Supports user-specific content customization.

### Shared Logic, Traits, and Services

- **Traits:**
  - Traits allow us to extract shared logic into reusable components. For example, if multiple controllers require similar filtering or logging logic, we can encapsulate this functionality in a trait and include it where needed.
  - This promotes code reusability and adheres to the DRY principle.

- **Services:**
  - Business logic and query building are delegated to services (such as `ArticleService`). This ensures that controllers remain slim and focused on handling requests and responses.
  - This approach follows the Single Responsibility Principle (SRP) of SOLID.

- **Best Practices:**
  - **DRY:** Shared functionality (e.g., query building, validation) is extracted into services or traits to avoid duplication.
  - **KISS:** Each class and method is kept as simple as possible, with clear responsibilities.
  - **SOLID Principles:**
    - _Single Responsibility:_ Each class or module handles one aspect of the application.
    - _Open/Closed:_ The system is designed to be extended (e.g., by adding new scraping jobs) without modifying existing code.
    - _Dependency Inversion:_ Controllers depend on abstractions (such as services) rather than concrete implementations.
    - _Interface Segregation & Liskov Substitution:_ Components are designed to be replaced or extended with minimal impact on the overall system.

### Background Jobs and Scraping

- **ScrapeNewsAPIJob, ScrapeGuardianJob, ScrapeNYTimesJob:**
  - Each job fetches data from its respective news source API.
  - They extract article information and update the local database using Eloquent’s `updateOrCreate` method.
  - Shared extraction and relationship mapping logic is encapsulated in helper methods to promote reusability and maintainability.

### User Preferences

- **UserPreferenceController:**
  - Provides CRUD operations for user preferences.
  - Automatically creates a preference record for new users.
  - Eager loads associated models (sources, categories, authors) for efficient data retrieval.

- **Authentication & Authorization:**
  - Uses Laravel Sanctum for token-based authentication.
  - Protected endpoints ensure only authenticated users can access or modify their preferences.

## Installation and Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/news-feed-api.git
   cd news-feed-api
   ```

2. **Install Dependencies**

   After cloning the repository, navigate to the project directory and install all required PHP dependencies using Composer. This ensures that you have all the libraries and packages needed to run the application.

   ```bash
   composer install
   ```

3. **Environment Setup and API Endpoints**

   ### Environment Setup

   #### 1. Create your env file

   Copy the example environment file to create your own configuration file:

   ```bash
   cp .env.example .env
   ```

   #### 2. Configure Environment Variables

   Open the newly created .env file and update the following settings as needed:

   - **Application Key:**

     Generate a new application key if one is not already set.

     ```bash
     php artisan key:generate
     ```

   - **Database Configuration:**

     Set up your database connection details (e.g., SQLite, MySQL, PostgreSQL). For example, for SQLite, ensure you have a database file created:

     ```bash
     touch database/database.sqlite
     ```

   - **API Keys:**

     Provide your API keys for external services under the services section:

     ```dotenv
     NEWSAPI_KEY=your_newsapi_key_here
     GUARDIAN_KEY=your_guardian_api_key_here
     NYTIMES_KEY=your_nytimes_api_key_here
     ```

   3. **Additional Configuration**

      Ensure any other settings (mail, cache, etc.) are configured according to your environment and requirements.

## API Endpoints

Once the environment is set up and migrations have been run, your API endpoints will be available. Here’s an overview of the key API endpoints:

### Public Endpoints

#### Hello Endpoint

A simple endpoint to verify that the API is running.

- **Endpoint:**  
  `GET /api/public/hello`

- **Example Request:**

  ```bash
  curl --location --request GET "http://127.0.0.1:8000/api/public/hello"
  ```

### Authentication Endpoints

#### Register a New User

```bash
curl --location --request POST "http://127.0.0.1:8000/api/public/register" \
     --header "Content-Type: application/json" \
     --data-raw '{
         "name": "John Doe",
         "email": "john@example.com",
         "password": "secret123",
         "password_confirmation": "secret123"
     }'
```

#### Login

```bash
curl --location --request POST "http://127.0.0.1:8000/api/login" \
     --header "Content-Type: application/json" \
     --data-raw '{
         "email": "john@example.com",
         "password": "secret123"
     }'
```

- **Example Response:**

  ```json
  {
      "access_token": "your_generated_token_here",
      "token_type": "Bearer"
  }
  ```

### Protected Endpoints

#### Get Authenticated User

```bash
curl --location --request GET "http://127.0.0.1:8000/api/user" \
     --header "Authorization: Bearer your_generated_token_here"
```

#### User Logout

```bash
curl --location --request POST "http://127.0.0.1:8000/api/logout" \
     --header "Authorization: Bearer your_generated_token_here"
```

#### Articles Endpoints

##### List Articles (with pagination, search, and filtering)

- **Endpoint:**  
  `GET /api/articles`

  - **Query Parameters:**

    - `keyword` (optional): Search term for article title or description.
    - `category` (optional): Filter by category ID.
    - `author` (optional): Filter by author ID.
    - `source` (optional): Filter by source ID.
    - `date` (optional): Filter by publication date (format: YYYY-MM-DD).
    - `dataSource` (optional): Filter by data source (e.g., “newsapi”, “guardian”, “nytimes”).

```bash
curl --location --request GET "http://127.0.0.1:8000/api/articles?keyword=laravel&category=2&author=3&source=1&date=2025-02-10" \
     --header "Authorization: Bearer your_generated_token_here"
```

- **Example Response:**

  ```json
  {
      "current_page": 1,
      "data": [
          {
              "id": 1,
              "title": "Laravel 101: Introduction to Laravel",
              "description": "An introductory guide to Laravel.",
              "published_at": "2025-02-10T12:34:56.000000Z",
              "category_id": 2,
              "author_id": 3,
              "source_id": 1,
              "category": {
                  "id": 2,
                  "name": "TECHNOLOGY"
              },
              "author": {
                  "id": 3,
                  "name": "Jane Doe"
              },
              "source": {
                  "id": 1,
                  "name": "NewsAPI Source"
              }
              // ... other article fields
          }
      ],
      "first_page_url": "...",
      "from": 1,
      "last_page": 5,
      "last_page_url": "...",
      "next_page_url": "...",
      "path": "...",
      "per_page": 10,
      "prev_page_url": null,
      "to": 10,
      "total": 50
  }
  ```

##### Search Articles (with Pagination and Additional Filtering)

- **Endpoint:**  
  `GET /api/articles/search`

  - **Query Parameters:**

    - `q` (required): The search term.
    - `author` (optional): Filter by author ID.
    - `category` (optional): Filter by category ID.
    - `source` (optional): Filter by source ID.

```bash
curl --location --request GET "http://127.0.0.1:8000/api/articles/search?q=laravel&author=3&category=2&source=1" \
     --header "Authorization: Bearer your_generated_token_here"
```

- **Example Response:**

  ```json
  {
      "message": "Search results",
      "articles": [
          {
              "id": 1,
              "title": "Laravel 101: Introduction to Laravel",
              "description": "An introductory guide to Laravel.",
              "published_at": "2025-02-10T12:34:56.000000Z",
              "category_id": 2,
              "author_id": 3,
              "source_id": 1,
              "category": {
                  "id": 2,
                  "name": "TECHNOLOGY"
              },
              "author": {
                  "id": 3,
                  "name": "Jane Doe"
              },
              "source": {
                  "id": 1,
                  "name": "NewsAPI Source"
              }
              // ... other article fields
          }
      ]
  }
  ```

#### User Preferences Endpoints

```bash
curl --location --request GET "http://127.0.0.1:8000/api/preferences" \
     --header "Authorization: Bearer your_generated_token_here"
```

Create/Update User Preferences

- **Create**

  ```bash
  curl --location --request POST "http://127.0.0.1:8000/api/preferences" \
       --header "Content-Type: application/json" \
       --header "Authorization: Bearer your_generated_token_here" \
       --data-raw '{
           "source_ids": [1, 2],
           "category_ids": [3, 4],
           "author_ids": [5]
       }'
  ```

- **Update**

  ```bash
  curl --location --request PUT "http://127.0.0.1:8000/api/preferences" \
       --header "Content-Type: application/json" \
       --header "Authorization: Bearer your_generated_token_here" \
       --data-raw '{
           "source_ids": [1, 3],
           "category_ids": [2],
           "author_ids": [4, 5]
       }'
  ```

Get Sources, Categories, and Authors

- **Sources**

  ```bash
  curl --location --request GET "http://127.0.0.1:8000/api/sources"
  ```

- **Categories**

  ```bash
  curl --location --request GET "http://127.0.0.1:8000/api/categories"
  ```

- **Authors**

  ```bash
  curl --location --request GET "http://127.0.0.1:8000/api/authors"
  ```

## Executing Jobs via API Route

In addition to using Artisan commands to execute background jobs, our application also provides a GET API route that dispatches the news scraping job (for testing or manual triggering).

### API Route Overview

- **Endpoint:** `GET /api/newsapi`
- **Description:** This route dispatches the `ScrapeNewsAPIJob` using sample data (for demonstration purposes). It can be used to test the job execution via an API call.

### How It Works

When a request is made to this endpoint:

1. The route calls a closure that dispatches the `ScrapeNewsAPIJob` with sample data.
2. The job is queued for asynchronous processing.
3. A response is immediately returned confirming that the job has been dispatched.

#### Testing the Route

You can test the route using a tool like `curl` or Postman.

##### Using curl

Run the following command in your terminal:

```bash
curl --location --request GET "http://127.0.0.1:8000/api/newsapi"
```

- **Expected Response**

  You should receive a response similar to:

  ```json
  "ScrapeNewsAPIJob dispatched!"
  ```

Meanwhile, you can monitor your Laravel log file (storage/logs/laravel.log) to see the job’s processing logs.

## Design Considerations and Best Practices

- **Separation of Concerns:**
  - Controllers are kept slim, delegating business logic to dedicated services (e.g., ArticleService). Models handle relationships and data persistence.

- **Trait Usage:**
  - Shared behavior or common functionality (such as filtering logic, logging, or transformation routines) can be abstracted into traits. This promotes reuse without duplication and keeps the controllers and services focused on their core responsibilities.

- **SOLID Principles:**
  - **Single Responsibility:** Each class and method has one clear purpose.
  - **Open/Closed:** The system is designed to be extended (e.g., new scraping jobs) without modifying existing code.
  - **Dependency Inversion:** High-level modules (controllers) depend on abstractions (services) rather than concrete implementations.
  - **Interface Segregation & Liskov Substitution:** Components and classes are designed to be easily replaced or modified without affecting system stability.

- **DRY & KISS:**
  - Common functionality is extracted into services, traits, and helper methods. The code remains straightforward and easy to understand, reducing the chance for bugs and making it easier to maintain.
```

