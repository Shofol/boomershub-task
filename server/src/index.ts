import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/errorHandler";
import scrapeRoutes from "./routes/scrapeRoutes";
import propertyRoutes from "./routes/propertyRoutes";
import { MinioService } from "./services/minioService";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://www.boomershub.com/"]
        : ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// API Routes
app.use("/api/scrape", scrapeRoutes);
app.use("/api/properties", propertyRoutes);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);

  // Initialize MinIO
  try {
    await MinioService.testConnection();
    await MinioService.initializeBucket();
  } catch (error) {
    console.error("⚠️ MinIO initialization failed:", error);
    console.log(
      "📝 Make sure MinIO is running with: docker run -p 9000:9000 -p 9090:9090 --name minio -v ~/minio/data:/data -e 'MINIO_ROOT_USER=root' -e 'MINIO_ROOT_PASSWORD=password' quay.io/minio/minio server /data --console-address ':9090'"
    );
  }
});

export default app;
