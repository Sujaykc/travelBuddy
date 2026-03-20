# ✈️ TravelBuddy Backend API

A complete, production-ready REST API built with **Node.js, Express, and MongoDB** for the TravelBuddy mobile application. TravelBuddy helps users plan trips, match with travelers heading to the same destination on identical dates, and forge lasting connections.

## 🌟 Features

- **Strict MVC Architecture:** Cleanly isolated data models, business controllers, and barrel-pattern ([index.js](cci:7://file:///D:/Backend%20code/travelBuddy/utils/index.js:0:0-0:0)) routing logic.
- **Robust Security:** `bcrypt` password hashing and strictly verified stateless `JWT` tokens with cross-device dynamic refresh token invalidation.
- **Input Validation:** Protective `Joi` schemas applied on all incoming request bodies to avoid payload tampering and injection.
- **Complete Endpoints:** Fully built REST lifecycle spanning Authentication, User Profiles, Trip Planning, Chatting, Connections, Memories, and active Notifications.
- **Device Support:** Ready for push notifications with automated `deviceToken` injection during sessions.

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js 
- **Database:** MongoDB & Mongoose
- **Security:** `jsonwebtoken` (JWT), `bcrypt`
- **Validation:** `Joi`

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js and MongoDB installed locally, or a remote MongoDB Atlas URI.

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/YourUsername/TravelBuddy-Backend.git
cd TravelBuddy-Backend
\`\`\`

### 2. Install dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Setup Environment Variables
Create a [.env](cci:7://file:///d:/Backend%20code/travelBuddy/.env:0:0-0:0) file in the root directory and configure your keys:
\`\`\`env
PORT=5000
MONGO_URI=mongodb://localhost:27017/travelbuddy
JWT_SECRET=your_super_secret_jwt_key
JWT_REFRESH_SECRET=your_super_secret_refresh_key
\`\`\`

### 4. Run the Server
\`\`\`bash
# Run in development mode with Nodemon
npm run dev

# Run in production mode
npm start
\`\`\`

## 📂 Project Structure
\`\`\`text
TravelBuddy/
├── config/             # Database initialization 
├── controllers/        # Core business logic (Auth, Chat, Trips, etc.)
├── middlewares/        # JWT Protectors and Error handlers
├── models/             # Mongoose Schemas (User, Trip, Message, etc.)
├── routes/             # Express API routing endpoints
├── utils/              # Helper functions (Token generators)
├── validations/        # Strict Joi payload schemas
└── server.js           # Main application entry point
\`\`\`

## 📝 Core API Modules Overview
* `/api/auth` - Handling signups, multi-device logins, social integrations, and token refreshing.
* `/api/users` - Handling JWT-protected profile modifications.
* `/api/trips` - Core CRUD mechanisms for logging user trip destinations and durations.
* `/api/matching` - An intelligent endpoint that queries MongoDB to find overlapping travelers based on destination and dates.
* `/api/connections` - Handles connection lifecycle (pending, accepting, rejecting).
* `/api/chats` - Secures messaging strictly between users with an `accepted` connection status.
* `/api/memories` - Stores historical trip data and location pins.

---
*Built perfectly utilizing Node.js standard practices.*
