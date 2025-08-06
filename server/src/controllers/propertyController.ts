import { Request, Response, NextFunction } from "express";
import { executeQuery } from "../database/connection";
import { Property } from "../models/Property";
import { MinioService } from "../services/minioService";

export class PropertyController {
  // Get all properties
  static async getAllProperties(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const query = `
        SELECT * FROM properties 
        ORDER BY created_at DESC
      `;

      const properties = (await executeQuery(query)) as any[];

      // Add image URLs to properties
      const propertiesWithImages = await Promise.all(
        properties.map(async (property) => {
          try {
            const mainImage = await MinioService.getPropertyMainImage(
              property.name
            );
            return {
              ...property,
              mainImage,
            };
          } catch (error) {
            console.error(
              `Error getting image for property ${property.name}:`,
              error
            );
            return property;
          }
        })
      );

      res.json({
        success: true,
        data: propertiesWithImages,
        message: "Properties retrieved successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // Get property by ID
  static async getPropertyById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      const query = "SELECT * FROM properties WHERE id = ?";
      const properties = (await executeQuery(query, [id])) as any[];

      if (properties.length === 0) {
        res.status(404).json({
          success: false,
          message: "Property not found",
        });
        return;
      }

      const property = properties[0];

      // Add image URLs to property
      try {
        console.log(`🖼️ Getting images for property: ${property.name}`);

        const mainImage = await MinioService.getPropertyMainImage(
          property.name
        );
        const images = await MinioService.getPropertyImages(property.name);

        console.log(
          `📊 Property ${property.name}: mainImage=${
            mainImage ? "found" : "not found"
          }, totalImages=${images.length}`
        );

        property.mainImage = mainImage;
        property.images = images;
      } catch (error) {
        console.error(
          `Error getting images for property ${property.name}:`,
          error
        );
      }

      res.json({
        success: true,
        data: property,
        message: "Property retrieved successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // Create new property
  static async createProperty(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const propertyData: Property = req.body;

      const query = `
        INSERT INTO properties (name, address, city, state, zipcode, county, phone, type, capacity)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const result = await executeQuery(query, [
        propertyData.name,
        propertyData.address || null,
        propertyData.city || null,
        propertyData.state || null,
        propertyData.zipcode || null,
        propertyData.county || null,
        propertyData.phone || null,
        propertyData.type || null,
        propertyData.capacity || null,
      ]);

      const insertId = (result as any).insertId;

      res.status(201).json({
        success: true,
        data: { id: insertId, ...propertyData },
        message: "Property created successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // Update property
  static async updateProperty(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const propertyData: Partial<Property> = req.body;

      const query = `
        UPDATE properties 
        SET name = ?, address = ?, city = ?, state = ?, zipcode = ?, 
            county = ?, phone = ?, type = ?, capacity = ?
        WHERE id = ?
      `;

      const result = await executeQuery(query, [
        propertyData.name,
        propertyData.address || null,
        propertyData.city || null,
        propertyData.state || null,
        propertyData.zipcode || null,
        propertyData.county || null,
        propertyData.phone || null,
        propertyData.type || null,
        propertyData.capacity || null,
        id,
      ]);

      if ((result as any).affectedRows === 0) {
        res.status(404).json({
          success: false,
          message: "Property not found",
        });
        return;
      }

      res.json({
        success: true,
        data: { id: parseInt(id), ...propertyData },
        message: "Property updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete property
  static async deleteProperty(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      const query = "DELETE FROM properties WHERE id = ?";
      const result = await executeQuery(query, [id]);

      if ((result as any).affectedRows === 0) {
        res.status(404).json({
          success: false,
          message: "Property not found",
        });
        return;
      }

      res.json({
        success: true,
        message: "Property deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // Get property images
  static async getPropertyImages(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      // Get property name from database
      const query = "SELECT name FROM properties WHERE id = ?";
      const properties = (await executeQuery(query, [id])) as any[];

      if (properties.length === 0) {
        res.status(404).json({
          success: false,
          message: "Property not found",
        });
        return;
      }

      const propertyName = properties[0].name;
      const images = await MinioService.getPropertyImages(propertyName);

      res.json({
        success: true,
        data: {
          propertyId: id,
          propertyName,
          images,
          count: images.length,
        },
        message: `Retrieved ${images.length} images for property ${propertyName}`,
      });
    } catch (error) {
      next(error);
    }
  }

  // Save scraped property data
  static async saveScrapedProperty(
    scrapedData: any,
    propertyName: string
  ): Promise<void> {
    try {
      const query = `
        INSERT INTO properties (name, address, city, county, zipcode, state)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
          address = VALUES(address),
          city = VALUES(city),
          county = VALUES(county),
          zipcode = VALUES(zipcode),
          state = VALUES(state)
      `;

      await executeQuery(query, [
        propertyName,
        scrapedData.address || null,
        scrapedData.city || null,
        scrapedData.county || null,
        scrapedData.zipcode || null,
        scrapedData.state || null,
      ]);
    } catch (error) {
      console.error("Error saving scraped property:", error);
      throw error;
    }
  }
}
