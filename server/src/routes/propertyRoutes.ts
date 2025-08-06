import { Router } from "express";
import { PropertyController } from "../controllers/propertyController";

const router = Router();

// Get all properties
router.get("/", PropertyController.getAllProperties);

// Get property by ID
router.get("/:id", PropertyController.getPropertyById);

// Get property images
router.get("/:id/images", PropertyController.getPropertyImages);

// Create new property
router.post("/", PropertyController.createProperty);

// Update property
router.put("/:id", PropertyController.updateProperty);

// Delete property
router.delete("/:id", PropertyController.deleteProperty);

export default router;
