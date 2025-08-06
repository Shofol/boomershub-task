import * as Minio from "minio";

// MinIO client configuration
const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || "localhost",
  port: parseInt(process.env.MINIO_PORT || "9000"),
  useSSL: process.env.MINIO_USE_SSL === "true",
  accessKey: process.env.MINIO_ACCESS_KEY || "root",
  secretKey: process.env.MINIO_SECRET_KEY || "password",
});

const BUCKET_NAME = "boomershub";

export class MinioService {
  // Initialize MinIO bucket
  static async initializeBucket(): Promise<void> {
    try {
      const bucketExists = await minioClient.bucketExists(BUCKET_NAME);
      if (!bucketExists) {
        await minioClient.makeBucket(BUCKET_NAME, "us-east-1");
        console.log(`✅ MinIO bucket '${BUCKET_NAME}' created successfully`);
      } else {
        console.log(`✅ MinIO bucket '${BUCKET_NAME}' already exists`);
      }
    } catch (error) {
      console.error("❌ Error initializing MinIO bucket:", error);
      throw error;
    }
  }

  // Generate presigned URL for image display
  static async getImageUrl(
    imageName: string,
    expirySeconds: number = 3600
  ): Promise<string> {
    try {
      const url = await minioClient.presignedGetObject(
        BUCKET_NAME,
        imageName,
        expirySeconds
      );
      return url;
    } catch (error) {
      console.error(
        `❌ Error generating presigned URL for ${imageName}:`,
        error
      );
      throw error;
    }
  }

  // Get all images for a property
  static async getPropertyImages(propertyName: string): Promise<string[]> {
    try {
      console.log(
        `🔍 Looking for images in bucket: ${BUCKET_NAME}/${propertyName}/`
      );

      // List all objects in the property folder
      const objectsStream = minioClient.listObjects(
        BUCKET_NAME,
        `${propertyName}/`,
        true
      );
      const foundObjects: string[] = [];

      return new Promise((resolve, reject) => {
        objectsStream.on("data", (obj) => {
          if (obj.name) {
            foundObjects.push(obj.name);
            console.log(`📸 Found object: ${obj.name}`);
          }
        });

        objectsStream.on("error", (error) => {
          console.error("Error listing objects:", error);
          reject(error);
        });

        objectsStream.on("end", async () => {
          console.log(
            `Found ${foundObjects.length} objects for ${propertyName}:`
          );
          console.log(`   - Objects: ${foundObjects.join(", ")}`);

          // Process images after all objects are found
          const imageUrls: string[] = [];

          for (const objName of foundObjects) {
            try {
              // Only process image files
              const imageExtensions = [
                ".jpg",
                ".jpeg",
                ".png",
                ".gif",
                ".webp",
              ];
              const isImage = imageExtensions.some((ext) =>
                objName.toLowerCase().endsWith(ext)
              );

              if (isImage) {
                console.log(`🖼️ Processing image: ${objName}`);
                const url = await this.getImageUrl(objName);
                imageUrls.push(url);
                console.log(`✅ Added image URL: ${url.substring(0, 50)}...`);
              } else {
                console.log(`⏭️ Skipping non-image file: ${objName}`);
              }
            } catch (error) {
              console.error(`❌ Error processing object ${objName}:`, error);
            }
          }
          resolve(imageUrls);
        });
      });
    } catch (error) {
      console.error(
        `❌ Error getting images for property ${propertyName}:`,
        error
      );
      return [];
    }
  }

  // Get main image for a property (first image)
  static async getPropertyMainImage(
    propertyName: string
  ): Promise<string | null> {
    try {
      const images = await this.getPropertyImages(propertyName);
      return images.length > 0 ? images[0] : null;
    } catch (error) {
      console.error(
        `❌ Error getting main image for property ${propertyName}:`,
        error
      );
      return null;
    }
  }

  // Test MinIO connection
  static async testConnection(): Promise<boolean> {
    try {
      await minioClient.listBuckets();
      console.log("✅ MinIO connection successful");
      return true;
    } catch (error) {
      console.error("❌ MinIO connection failed:", error);
      return false;
    }
  }
}
