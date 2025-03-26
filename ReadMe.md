# Journal API

A RESTful API for managing personal journal entries built with TypeScript, Express, and MySQL, featuring AI-powered insights.

## Technology Stack

### Backend
- Node.js & Express.js
- TypeScript
- MySQL with TypeORM
- JWT Authentication
- OpenAI API Integration

### Testing
- Jest
- Supertest
- ts-jest

### Development Tools
- TypeScript
- ESLint
- Winston Logger
- Express Validator
- dotenv

## Features

- User Authentication with JWT
- Journal Entry Management (CRUD operations)
- Category and Tag Support
- Advanced Filtering and Search
- Data Analytics and Summaries
- Role-based Access Control
- AI-Powered Features:
  - Sentiment Analysis
  - Theme Detection
  - Category Suggestions
  - Writing Style Analysis
  - Personalized Writing Prompts
  - Pattern Recognition

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn
- OpenAI API key

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd journal-api
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
# Server Configuration
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=journal_db

# JWT Configuration
JWT_SECRET=your_generated_secret_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key
```

4. Generate a JWT secret key:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

5. Create the database:
```sql
CREATE DATABASE journal_db;
```

6. Run database migrations:
```bash
npm run migration:generate
npm run migration:run
```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

### Testing
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

# Run only E2E tests
npm run test:e2e
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive JWT token

### Journal Entries
- `GET /api/journals` - Get all entries (with pagination and filters)
- `POST /api/journals` - Create a new entry
- `PUT /api/journals/:id` - Update an entry
- `DELETE /api/journals/:id` - Delete an entry
- `GET /api/journals/summary` - Get entry statistics and summaries

### Categories
- `GET /api/categories` - Get user's categories
- `POST /api/categories` - Create a new category

## Request Examples

### Register a New User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Create a Journal Entry
```bash
curl -X POST http://localhost:5000/api/journals \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Entry",
    "content": "This is the content of my journal entry",
    "mood": "happy",
    "categoryId": 1,
    "tags": [1, 2, 3]
  }'
```

### Get Entries with Filters
```bash
curl -X GET "http://localhost:5000/api/journals?page=1&limit=10&category=1&mood=happy" \
  -H "Authorization: Bearer your_jwt_token"
```

## Project Structure
src/
├── config/
│ └── database.ts
├── controllers/
│ ├── AuthController.ts
│ └── JournalController.ts
├── middleware/
│ ├── auth.ts
│ ├── validation.ts
│ └── requestLogger.ts
├── models/
│ ├── User.ts
│ └── JournalEntry.ts
├── routes/
│ ├── authRoutes.ts
│ └── journalRoutes.ts
├── utils/
│ └── logger.ts
├── data-source.ts
└── index.ts

## Testing Coverage

The project includes comprehensive test coverage:
- Unit tests for services and utilities
- Integration tests for controllers
- E2E tests for API endpoints
- Test coverage reporting
- Separate test database configuration
- Mock implementations for external services

## Environment Files

The project uses different environment files for different contexts:
- `.env` - Development environment
- `.env.test` - Testing environment
- `.env.production` - Production environment

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details