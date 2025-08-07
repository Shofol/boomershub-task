import * as Minio from "minio";
import * as fs from "fs";
import * as path from "path";

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
      const objectsStream = minioClient.listObjects(
        BUCKET_NAME,
        `${propertyName}/`
      );
      const foundObjects: string[] = [];

      return new Promise((resolve, reject) => {
        objectsStream.on("data", (obj) => {
          if (obj.name) {
            foundObjects.push(obj.name);
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
                const url = await this.getImageUrl(objName);
                imageUrls.push(url);
              } else {
                console.log(`⏭️ Skipping non-image file: ${objName}`);
              }
            } catch (error) {
              console.error(`Error processing object ${objName}:`, error);
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

  // Upload property images from assets folder to MinIO
  static async uploadPropertyImages(propertyName: string): Promise<string[]> {
    try {
      const assetsPath = path.join(__dirname, "../../assets", propertyName);

      // Check if the property folder exists
      if (!fs.existsSync(assetsPath)) {
        console.log(`⚠️ No assets folder found for property: ${propertyName}`);
        return [];
      }

      const uploadedImages: string[] = [];
      const files = fs.readdirSync(assetsPath);

      for (const file of files) {
        const filePath = path.join(assetsPath, file);
        const stats = fs.statSync(filePath);

        // Only process files (not directories)
        if (stats.isFile()) {
          // Check if it's an image file
          const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
          const isImage = imageExtensions.some((ext) =>
            file.toLowerCase().endsWith(ext)
          );

          if (isImage) {
            try {
              const objectName = `${propertyName}/${file}`;
              const fileStream = fs.createReadStream(filePath);

              await minioClient.putObject(
                BUCKET_NAME,
                objectName,
                fileStream,
                stats.size,
                {
                  "Content-Type": this.getContentType(file),
                }
              );

              console.log(`✅ Uploaded: ${objectName}`);
              uploadedImages.push(objectName);
            } catch (error) {
              console.error(`❌ Error uploading ${file}:`, error);
            }
          } else {
            console.log(`⏭️ Skipping non-image file: ${file}`);
          }
        }
      }

      console.log(
        `📁 Uploaded ${uploadedImages.length} images for property: ${propertyName}`
      );
      return uploadedImages;
    } catch (error) {
      console.error(
        `❌ Error uploading images for property ${propertyName}:`,
        error
      );
      return [];
    }
  }

  // Helper method to get content type based on file extension
  private static getContentType(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    const contentTypes: { [key: string]: string } = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp",
    };
    return contentTypes[ext] || "application/octet-stream";
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
