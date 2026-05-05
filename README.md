# Library Management System

A Vue.js frontend with Node.js backend application.

## Project Structure

```
Library Management System/       # Vue.js frontend
server/           # Node.js backend
```

## Setup

### Client Setup
```bash
cd Library Management System
npm install
npm run serve
```

### Server Setup
```bash
cd server
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Start development server
npm run dev
```

## Environment Variables

Create `.env` files in both root and server directories:

**Client (.env)**
```env
VUE_APP_API_BASE_URL=http://localhost:5000/api
```

**Server (.env)**
```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=myproject
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=1h
```

## Features

- **Frontend**: Vue 3, Vue Router, Vuex
- **Backend**: Express.js, Sequelize ORM
- **Authentication**: JWT
- **Database**: MySQL

## Scripts

| Command         | Description                     |
|-----------------|---------------------------------|
| `npm run serve` | Run Vue dev server             |
| `npm run build` | Build for production           |
| `npm run dev`   | Run Node server with nodemon   |
| `npm test`      | Run tests                      |

## Deployment

1. Build frontend:
```bash
cd Library Management System
npm run build
```

2. Start production server:
```bash
cd server
npm start
```