import { Router } from "express";
import { UserController } from "../controllers/userController";

const router = Router();

// GET /api/users - Get all users (with pagination)
router.get("/", UserController.getAllUsers);

// GET /api/users/:id - Get user by ID
router.get("/:id", UserController.getUserById);

// POST /api/users - Create new user
router.post("/", UserController.createUser);

// PUT /api/users/:id - Update user
router.put("/:id", UserController.updateUser);

// DELETE /api/users/:id - Delete user
router.delete("/:id", UserController.deleteUser);

export default router;
