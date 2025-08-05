import { Request, Response, NextFunction } from "express";
import { UserModel, CreateUserData, UpdateUserData } from "../models/User";

export class UserController {
  // Get all users
  static async getAllUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Ensure page and limit are valid numbers with proper fallbacks
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.max(
        1,
        Math.min(100, parseInt(req.query.limit as string) || 10)
      );

      const result = await UserModel.findWithPagination(page, limit);

      res.json({
        success: true,
        data: result.users,
        pagination: {
          page: result.page,
          limit,
          total: result.total,
          totalPages: result.totalPages,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Get user by ID
  static async getUserById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: "Invalid user ID",
        });
        return;
      }

      const user = await UserModel.findById(id);

      if (!user) {
        res.status(404).json({
          success: false,
          error: "User not found",
        });
        return;
      }

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  // Create new user
  static async createUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { name, email, age } = req.body;

      // Validation
      if (!name || !email || !age) {
        res.status(400).json({
          success: false,
          error: "Name, email, and age are required",
        });
        return;
      }

      if (typeof age !== "number" || age < 1 || age > 120) {
        res.status(400).json({
          success: false,
          error: "Age must be a number between 1 and 120",
        });
        return;
      }

      // Check if email already exists
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        res.status(409).json({
          success: false,
          error: "Email already exists",
        });
        return;
      }

      const userData: CreateUserData = { name, email, age };
      const newUser = await UserModel.create(userData);

      res.status(201).json({
        success: true,
        data: newUser,
        message: "User created successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // Update user
  static async updateUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: "Invalid user ID",
        });
        return;
      }

      const { name, email, age } = req.body;
      const updateData: UpdateUserData = {};

      // Only include fields that are provided
      if (name !== undefined) updateData.name = name;
      if (email !== undefined) updateData.email = email;
      if (age !== undefined) {
        if (typeof age !== "number" || age < 1 || age > 120) {
          res.status(400).json({
            success: false,
            error: "Age must be a number between 1 and 120",
          });
          return;
        }
        updateData.age = age;
      }

      // Check if user exists
      const existingUser = await UserModel.findById(id);
      if (!existingUser) {
        res.status(404).json({
          success: false,
          error: "User not found",
        });
        return;
      }

      // Check if email is being updated and already exists
      if (email && email !== existingUser.email) {
        const userWithEmail = await UserModel.findByEmail(email);
        if (userWithEmail) {
          res.status(409).json({
            success: false,
            error: "Email already exists",
          });
          return;
        }
      }

      const updatedUser = await UserModel.update(id, updateData);

      res.json({
        success: true,
        data: updatedUser,
        message: "User updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete user
  static async deleteUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: "Invalid user ID",
        });
        return;
      }

      const deleted = await UserModel.delete(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          error: "User not found",
        });
        return;
      }

      res.json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
