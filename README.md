# BoomersHub Task - Full Stack Application

A modern full-stack application built with **Next.js**, **Express.js**, and **MySQL**. This project demonstrates a complete CRUD application with a beautiful UI and robust backend API.

## 🏗️ Architecture

- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Backend**: Express.js with TypeScript
- **Database**: MySQL with connection pooling
- **Shared**: Common types and utilities

## 🚀 Features

- **User Management**: Complete CRUD operations for users
- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **Type Safety**: Full TypeScript support across the stack
- **API Validation**: Comprehensive input validation and error handling
- **Database**: MySQL with migrations and seeding
- **Development**: Hot reloading and concurrent development servers

## 📁 Project Structure

```
boomershub-task/
├── client/                 # Next.js frontend
│   ├── app/               # App router pages
│   ├── components/        # React components
│   └── package.json
├── server/                # Express.js backend
│   ├── src/
│   │   ├── controllers/   # API controllers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── database/      # Database connection & migrations
│   │   └── middleware/    # Express middleware
│   └── package.json
├── shared/                # Shared types and utilities
│   ├── src/
│   │   └── types/         # Common TypeScript types
│   └── package.json
└── package.json           # Root package.json (workspaces)
```

## 🛠️ Prerequisites

- **Node.js** (v18 or higher)
- **MySQL** (v8.0 or higher)
- **npm** or **yarn**

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd boomershub-task
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up the database**
   - Create a MySQL database named `boomershub_task`
   - Copy `server/env.example` to `server/.env`
   - Update the database credentials in `server/.env`

4. **Run database migrations and seeding**
   ```bash
   cd server
   npm run build
   npm run db:migrate
   npm run db:seed
   ```

## 🚀 Development

### Start all services (recommended)
```bash
npm run dev
```

This will start both the client (port 3000) and server (port 3001) concurrently.

### Start services individually

**Frontend (Next.js)**
```bash
npm run dev:client
# or
cd client && npm run dev
```

**Backend (Express.js)**
```bash
npm run dev:server
# or
cd server && npm run dev
```

## 🌐 API Endpoints

### Users API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users (with pagination) |
| GET | `/api/users/:id` | Get user by ID |
| POST | `/api/users` | Create new user |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health status |

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  age INT NOT NULL CHECK (age > 0 AND age <= 120),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🎨 Frontend Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Updates**: Automatic refresh after CRUD operations
- **Form Validation**: Client-side validation with error handling
- **Loading States**: Beautiful loading indicators
- **Error Handling**: User-friendly error messages

## 🔧 Backend Features

- **TypeScript**: Full type safety
- **Error Handling**: Comprehensive error middleware
- **Validation**: Input validation and sanitization
- **Database Pooling**: Efficient MySQL connection management
- **CORS**: Configured for development and production
- **Security**: Helmet.js for security headers

## 📝 Environment Variables

### Server (.env)
```env
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=boomershub_task
```

## 🏗️ Build & Deployment

### Build all packages
```bash
npm run build
```

### Production start
```bash
npm start
```

## 🧪 Testing

The application includes comprehensive error handling and validation. You can test the API endpoints using tools like:

- **Postman**
- **Insomnia**
- **cURL**

Example API calls:
```bash
# Get all users
curl http://localhost:3001/api/users

# Create a user
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","age":30}'
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure MySQL is running
   - Check database credentials in `.env`
   - Verify database exists

2. **Port Already in Use**
   - Change ports in `.env` files
   - Kill processes using the ports

3. **TypeScript Errors**
   - Run `npm run build` in each package
   - Check for missing dependencies

### Getting Help

If you encounter any issues, please:
1. Check the console for error messages
2. Verify all prerequisites are installed
3. Ensure database is properly configured
4. Check that all services are running

---

**Happy Coding! 🎉** 