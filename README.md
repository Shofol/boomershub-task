# BoomersHub Task - Full Stack Application

A modern full-stack application built with **Next.js**, **Express.js**, and **MySQL**. This project demonstrates a complete CRUD application with a beautiful UI and robust backend API.

## 🏗️ Architecture

- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Backend**: Express.js with TypeScript
- **Database**: MySQL with connection pooling
- **Shared**: Common types and utilities

## 🚀 Features

- **Property Management**: Display and manage scraped properties
- **Search Functionality**: Search properties by name, city, or state
- **Property Details**: Detailed property view with image gallery
- **Image Navigation**: Click through property images with thumbnails
- **Web Scraping**: Automated property data scraping with CSV integration
- **Image Storage**: MinIO integration for property image storage and display
- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **Type Safety**: Full TypeScript support across the stack
- **API Validation**: Comprehensive input validation and error handling
- **Database**: MySQL with migrations (no seeding required)
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
- **Docker** (for MinIO)
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

4. **Run database migrations**
   ```bash
   cd server
   npm run build
   npm run db:migrate
   ```

5. **Start MinIO for image storage (optional)**
   ```bash
   ./start-minio.sh
   ```
   Or manually:
   ```bash
   mkdir -p ~/minio/data
   docker run -p 9000:9000 -p 9090:9090 --name minio -v ~/minio/data:/data -e "MINIO_ROOT_USER=root" -e "MINIO_ROOT_PASSWORD=password" quay.io/minio/minio server /data --console-address ":9090"
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

### Properties API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/properties` | Get all properties (with images) |
| GET | `/api/properties/:id` | Get property by ID (with all images) |
| GET | `/api/properties/:id/images` | Get all images for a property |
| DELETE | `/api/properties/:id` | Delete property |

### Scraping API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/scrape` | Run property scraper with CSV data |

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health status |

## 📊 Database Schema

### Properties Table
```sql
CREATE TABLE properties (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(500),
  city VARCHAR(255),
  county VARCHAR(255),
  zipcode VARCHAR(20),
  state VARCHAR(100),
  phone VARCHAR(50),
  type VARCHAR(255),
  capacity INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```



## 🖼️ Image Storage (MinIO)
```
boomershub/
├── Brookdale Creekside/     # Property name
│   ├── brookdale-creekside-1-entrance_sd.jpg
│   ├── brookdale-creekside-4-bedroom_sd.jpg
│   └── brookdale-creekside-5-living-room_sd.jpg
└── The Delaney At Georgetown Village/  # Property name
    ├── TheDelaneyAtGeorgetownVillage_photos_01_Seniorly_sd.png
    └── ...
```

### Automatic Image Upload

When properties are scraped and saved to the database, their corresponding images are automatically uploaded to MinIO:

1. **Automatic Upload**: Images are uploaded when `saveScrapedProperty()` is called
2. **Path Structure**: Images are stored as `boomershub/{propertyName}/{filename}`
3. **Asset Location**: Images must be in `server/assets/{propertyName}/` folder
4. **Supported Formats**: JPG, JPEG, PNG, GIF, WEBP

### Manual Image Upload

You can also manually upload images for existing properties:

```bash
# Upload images for a specific property
curl -X POST http://localhost:3001/api/properties/Brookdale%20Creekside/upload-images

# Upload images for all properties
curl -X POST http://localhost:3001/api/properties/upload-all-images
```

**Important**: Images must be stored using the exact property name as the folder name, matching the property names in your CSV file.

## 🎨 Frontend Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Search Interface**: Real-time search by property name, city, or state
- **Property Details**: Dedicated page for each property with full information
- **Image Gallery**: Interactive image navigation with thumbnails
- **Real-time Updates**: Automatic refresh after operations
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

# MinIO Configuration
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=root
MINIO_SECRET_KEY=password
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
# Get all properties
curl http://localhost:3001/api/properties

# Get property images
curl http://localhost:3001/api/properties/1/images

# Run scraper to populate database
curl http://localhost:3001/api/scrape

# Test CSV reading
curl http://localhost:3001/api/scrape/test-csv
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

2. **MinIO Connection Error**
   - Ensure MinIO is running: `docker ps | grep minio`
   - Check MinIO logs: `docker logs minio`
   - Verify MinIO credentials in `.env`

3. **Port Already in Use**
   - Change ports in `.env` files
   - Kill processes using the ports

4. **TypeScript Errors**
   - Run `npm run build` in each package
   - Check for missing dependencies

5. **Image Display Issues**
   - Check MinIO console at http://localhost:9090
   - Verify `boomershub` bucket exists
   - Ensure images are uploaded with correct paths

### Getting Help

If you encounter any issues, please:
1. Check the console for error messages
2. Verify all prerequisites are installed
3. Ensure database is properly configured
4. Check that all services are running

---

**Happy Coding! 🎉** 