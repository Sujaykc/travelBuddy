# ✈️ TravelBuddy Backend API

A REST API built with Node.js, Express, and MongoDB for TravelBuddy. This application has been restructured into a **Versioned Clean Architecture** to ensure scalability, maintainability, and testability.

## 🌟 Features

- **Versioned Clean Architecture:** Decoupled layers (Controllers, Use Cases, Entities, Repositories) for high modularity.
- **Dependency Injection:** Centralized composition root in `src/app/index.js` for managing dependencies.
- **JWT Authentication:** Secure access and refresh token mechanism with OTP-based email verification and password reset.
- **Feature-Based Controllers:** Self-contained feature folders containing controllers, Joi validators, mappers, and DTOs.
- **Infrastructure Isolation:** Services for Email (AWS SES), OTP, and Tokens are isolated from business logic.
- **Comprehensive Testing:** Unit and integration tests using Jest and Supertest.
- **Security Middleware:** Implementation of Helmet, rate limiting, HPP, and XSS protection.

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express
- **Database:** MongoDB + Mongoose
- **Validation:** Joi
- **Auth:** JWT, bcryptjs
- **Email:** AWS SES (SESv2)
- **Logging:** Winston + Morgan
- **Testing:** Jest + Supertest

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB instance (local or Atlas)
- AWS Account (for SES email service)

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
Create a `.env` file in the root directory:
```env
NODE_ENV=development
PORT=5000

MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/travelbuddy
JWT_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
OTP_TTL_MINUTES=10
OTP_LENGTH=6

EMAIL_ENABLED=true
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=ap-south-1
SES_SENDER_EMAIL=no-reply@travelbuddy.com
SES_SENDER_NAME=TravelBuddy
```

### 3. Run the server
```bash
# Development (with nodemon)
npm run dev

# Production
npm start
```

### 4. Run tests
```bash
# All tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## 📂 Project Structure

```text
src/
├── app/              # Composition root and DI container
├── config/           # Global configuration (Auth, etc.)
├── database/         # Mongoose connection logic
├── helpers/          # Global utilities (logger, asyncHandler)
├── middlewares/      # Shared Express middlewares (Auth, Rate Limiters)
├── routes/           # Versioned route definitions
└── v1/               # API Version 1
    ├── app/          # V1 Application layer
    │   ├── controllers/ # Feature-based folders (Controller, DTO, Mapper, Validator)
    │   │   ├── auth/
    │   │   ├── chat/
    │   │   ├── trip/
    │   │   └── ...
    │   ├── entities/    # Domain entities and repositories
    │   └── usecases/    # Pure business logic (decoupled from Express)
    ├── models/       # Mongoose schemas/models
    └── services/     # Shared infrastructure services (Email, Token, OTP)
```

## 🗺️ API Routes (V1)

All routes are prefixed with `/api/v1`.

- `auth/` - Authentication & Account Management (Signup, Login, OTP, Password Reset)
- `user/` - User Profile Management
- `trip/` - Trip Planning and Management
- `matching/` - Traveler Matching Engine
- `connection/` - Social Connections and Requests
- `chat/` - Real-time Messaging & History
- `notification/` - User Notifications
- `memory/` - Travel Memories (CRUD)

## 🧪 Testing

The project uses Jest for testing. Tests are located in the `__tests__` directory, mirroring the source structure.
- **Unit Tests:** Business logic in use cases.
- **Integration Tests:** API endpoints and middleware.

## 📜 License

This project is proprietary. All rights reserved.
