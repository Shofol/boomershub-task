import { Router } from "express";
import { PropertyController } from "../controllers/propertyController";

const router = Router();

// Get all properties
router.get("/", PropertyController.getAllProperties);

// Get property by ID
router.get("/:id", PropertyController.getPropertyById);

// Get property images
router.get("/:id/images", PropertyController.getPropertyImages);

export default router;
