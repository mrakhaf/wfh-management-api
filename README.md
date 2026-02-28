# WFH Management API

A comprehensive NestJS-based API for managing Work From Home (WFH) attendance tracking. This system provides endpoints for employee attendance management, dashboard analytics, and comprehensive reporting.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Usage Examples](#usage-examples)
- [Testing](#testing)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Attendance Management**: Track employee check-in/check-out times
- **Dashboard Analytics**: Comprehensive reporting and statistics
- **JWT Authentication**: Secure API access with token-based authentication
- **Database Integration**: MySQL with Prisma ORM
- **Input Validation**: Comprehensive request validation using class-validator
- **Error Handling**: Custom error filters and standardized responses
- **Response Interception**: Consistent API response format
- **CORS Support**: Configurable cross-origin resource sharing

## Tech Stack

- **Backend Framework**: [NestJS](https://nestjs.com/) v11.1.14
- **Database**: MySQL with [Prisma ORM](https://www.prisma.io/) v5.22.0
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: class-validator & class-transformer
- **HTTP Client**: Axios
- **Date/Time**: Day.js
- **Testing**: Jest
- **Code Quality**: ESLint & Prettier

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.0.0 or higher
- **npm**: v8.0.0 or higher
- **MySQL**: Database server
- **Git**: Version control

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd wfh-management-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

#### Initialize Prisma
```bash
npx prisma init
```

#### Run Migrations
```bash
npx prisma migrate dev --name init
```

#### Generate Prisma Client
```bash
npx prisma generate
```

### 4. Environment Configuration

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000

# Database Configuration
DATABASE_URL="mysql://username:password@localhost:3306/wfh_management"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="24h"

# CORS Configuration
CORS_ORIGIN="http://localhost:3000"
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `DATABASE_URL` | MySQL connection string | - |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRES_IN` | JWT token expiration | 24h |
| `CORS_ORIGIN` | Allowed CORS origins | * |

### Database Schema

The system uses a single `attendances` table:

```sql
CREATE TABLE attendances (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  tap_in DATETIME NULL,
  tap_out DATETIME NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## API Documentation

### Base URL

```
http://localhost:3000
```

### Authentication

All endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Response Format

All API responses follow a consistent format:

```json
{
  "success": boolean,
  "data": any,
  "timestamp": string
}
```

For errors:

```json
{
  "success": false,
  "statusCode": number,
  "timestamp": string,
  "path": string,
  "message": string
}
```

## Endpoints

### 1. Get Attendance Today

Get the current day's attendance record for a user.

**GET** `/attendance/today`

**Query Parameters:**
- `user_id` (required): User identifier

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clx123",
    "userId": "123",
    "tapIn": "2024-01-15T08:00:00.000Z",
    "tapOut": null,
    "createdAt": "2024-01-15T08:00:00.000Z",
    "updatedAt": "2024-01-15T08:00:00.000Z"
  },
  "timestamp": "2024-01-15T10:00:00.000Z"
}
```

**If no attendance exists:**
```json
{
  "success": true,
  "data": null,
  "timestamp": "2024-01-15T10:00:00.000Z"
}
```

### 2. Create/Update Attendance (Tap In/Tap Out)

Create a new attendance record or update existing one (tap in/out).

**POST** `/attendance/absence`

**Request Body:**
```json
{
  "user_id": "123"
}
```

**Response (Tap In):**
```json
{
  "success": true,
  "data": {
    "id": "clx123",
    "userId": "123",
    "tapIn": "2024-01-15T08:00:00.000Z",
    "tapOut": null,
    "createdAt": "2024-01-15T08:00:00.000Z",
    "updatedAt": "2024-01-15T08:00:00.000Z"
  },
  "timestamp": "2024-01-15T10:00:00.000Z"
}
```

**Response (Tap Out):**
```json
{
  "success": true,
  "data": {
    "id": "clx123",
    "userId": "123",
    "tapIn": "2024-01-15T08:00:00.000Z",
    "tapOut": "2024-01-15T17:00:00.000Z",
    "createdAt": "2024-01-15T08:00:00.000Z",
    "updatedAt": "2024-01-15T17:00:00.000Z"
  },
  "timestamp": "2024-01-15T10:00:00.000Z"
}
```

**Error Response:**
```json
{
  "success": false,
  "statusCode": 400,
  "timestamp": "2024-01-15T10:00:00.000Z",
  "path": "/attendance/absence",
  "message": "Already completed attendance today"
}
```

### 3. Get Attendances by User

Get attendance records for a specific user within a date range.

**GET** `/attendance/user/:user_id`

**Path Parameters:**
- `user_id` (required): User identifier

**Query Parameters:**
- `start_date` (optional): Start date (YYYY-MM-DD format)
- `end_date` (optional): End date (YYYY-MM-DD format)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx123",
      "userId": "123",
      "tapIn": "2024-01-15T08:00:00.000Z",
      "tapOut": "2024-01-15T17:00:00.000Z",
      "createdAt": "2024-01-15T08:00:00.000Z",
      "updatedAt": "2024-01-15T17:00:00.000Z"
    }
  ],
  "timestamp": "2024-01-15T10:00:00.000Z"
}
```

### 4. Dashboard Analytics

Get comprehensive dashboard data for attendance analytics. **⚠️ Requires HRD Dashboard Guard**

**GET** `/attendance/dashboard`

**Query Parameters:**
- `month` (required): Month (1-12)
- `year` (required): Year (e.g., 2026)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Records per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "month": 2,
    "year": 2026,
    "total_users": 50,
    "days_in_month": 28,
    "current_page": 1,
    "total_page": 3,
    "data": [
      {
        "id": "user-123",
        "name": "John Doe",
        "total_present": 20,
        "total_completed": 18,
        "total_tap_in_only": 2,
        "total_absent": 8,
        "1": "COMPLETED",
        "2": "TAP_IN_ONLY",
        "3": "ABSENT",
        "4": "COMPLETED",
        "5": "COMPLETED",
        "6": "COMPLETED",
        "7": "COMPLETED",
        "8": "COMPLETED",
        "9": "COMPLETED",
        "10": "COMPLETED",
        "11": "COMPLETED",
        "12": "COMPLETED",
        "13": "COMPLETED",
        "14": "COMPLETED",
        "15": "COMPLETED",
        "16": "COMPLETED",
        "17": "COMPLETED",
        "18": "COMPLETED",
        "19": "COMPLETED",
        "20": "COMPLETED",
        "21": "ABSENT",
        "22": "ABSENT",
        "23": "ABSENT",
        "24": "ABSENT",
        "25": "ABSENT",
        "26": "ABSENT",
        "27": "ABSENT",
        "28": "ABSENT"
      }
    ]
  },
  "timestamp": "2026-02-15T10:00:00.000Z"
}
```

**Daily Status Values:**
- `COMPLETED`: User has both tap in and tap out
- `TAP_IN_ONLY`: User has only tap in (no tap out yet)
- `ABSENT`: User has no attendance record for that day

**Error Response:**
```json
{
  "success": false,
  "statusCode": 400,
  "timestamp": "2026-02-15T10:00:00.000Z",
  "path": "/attendance/dashboard",
  "message": "Invalid month or year parameters"
}
```

## Usage Examples

### cURL Examples

#### Get Today's Attendance
```bash
curl -X GET "http://localhost:3000/attendance/today?user_id=123" \
  -H "Authorization: Bearer your-jwt-token"
```

#### Tap In/Tap Out
```bash
curl -X POST "http://localhost:3000/attendance/absence" \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{"user_id": "123"}'
```

#### Get User Attendance History
```bash
curl -X GET "http://localhost:3000/attendance/user/123?start_date=2024-01-01&end_date=2024-01-31" \
  -H "Authorization: Bearer your-jwt-token"
```

#### Dashboard Analytics
```bash
curl -X GET "http://localhost:3000/attendance/dashboard?month=2&year=2026&page=1&limit=10" \
  -H "Authorization: Bearer your-jwt-token"
```

### JavaScript/Node.js Example

```javascript
const axios = require('axios');

const API_BASE = 'http://localhost:3000';
const JWT_TOKEN = 'your-jwt-token';

async function getTodayAttendance(userId) {
  try {
    const response = await axios.get(`${API_BASE}/attendance/today`, {
      params: { user_id: userId },
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`
      }
    });
    
    console.log('Today\'s attendance:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response.data);
  }
}

async function tapInOut(userId) {
  try {
    const response = await axios.post(`${API_BASE}/attendance/absence`, {
      user_id: userId
    }, {
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Attendance updated:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response.data);
  }
}
```

## Testing

### Run Tests

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Test coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

### Test Structure

- **Unit Tests**: Located in `src/**/*.spec.ts`
- **E2E Tests**: Located in `test/**/*.e2e-spec.ts`
- **Test Configuration**: `test/jest-e2e.json`

## Development

### Development Server

```bash
# Start development server with auto-reload
npm run start:dev

# Start with debug mode
npm run start:debug
```

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm run start:prod
```

### Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format
```

## Deployment

### Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
```

Build and run:

```bash
docker build -t wfh-management-api .
docker run -p 3000:3000 wfh-management-api
```

### Environment Variables for Production

```env
PORT=3000
DATABASE_URL="mysql://prod_user:prod_password@prod_host:3306/prod_db"
JWT_SECRET="production-secret-key"
JWT_EXPIRES_IN="24h"
CORS_ORIGIN="https://your-frontend-domain.com"
```

### Database Migration in Production

```bash
# Deploy migrations
npx prisma migrate deploy

# Generate client
npx prisma generate
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use ESLint for linting
- Use Prettier for formatting
- Follow TypeScript best practices
- Write tests for new features

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:

- Create an issue on GitHub
- Join our Discord community
- Email: support@wfhmanagement.com

## Changelog

### v1.0.0
- Initial release
- Attendance management endpoints
- Dashboard analytics
- JWT authentication
- Database integration with Prisma

## Contact

- **Developer**: [Your Name]
- **Email**: your-email@example.com
- **Website**: https://wfhmanagement.com

---

**Note**: This API is designed for internal use and should be protected behind proper authentication and authorization mechanisms.