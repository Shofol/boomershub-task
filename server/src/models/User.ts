import { executeQuery } from "../database/connection";

export interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  created_at: string;
  updated_at: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  age: number;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  age?: number;
}

export class UserModel {
  // Get all users
  static async findAll(): Promise<User[]> {
    const query = `
      SELECT id, name, email, age, created_at, updated_at 
      FROM users 
      ORDER BY created_at DESC
    `;
    const result = (await executeQuery(query)) as any[];
    return result;
  }

  // Get user by ID
  static async findById(id: number): Promise<User | null> {
    const query = `
      SELECT id, name, email, age, created_at, updated_at 
      FROM users 
      WHERE id = ?
    `;
    const result = (await executeQuery(query, [id])) as any[];
    return result.length > 0 ? result[0] : null;
  }

  // Get user by email
  static async findByEmail(email: string): Promise<User | null> {
    const query = `
      SELECT id, name, email, age, created_at, updated_at 
      FROM users 
      WHERE email = ?
    `;
    const result = (await executeQuery(query, [email])) as any[];
    return result.length > 0 ? result[0] : null;
  }

  // Create new user
  static async create(userData: CreateUserData): Promise<User> {
    const query = `
      INSERT INTO users (name, email, age) 
      VALUES (?, ?, ?)
    `;
    const result = (await executeQuery(query, [
      userData.name,
      userData.email,
      userData.age,
    ])) as any;

    const newUser = await this.findById(result.insertId);
    if (!newUser) {
      throw new Error("Failed to create user");
    }

    return newUser;
  }

  // Update user
  static async update(
    id: number,
    userData: UpdateUserData
  ): Promise<User | null> {
    const updateFields: string[] = [];
    const updateValues: any[] = [];

    if (userData.name !== undefined) {
      updateFields.push("name = ?");
      updateValues.push(userData.name);
    }
    if (userData.email !== undefined) {
      updateFields.push("email = ?");
      updateValues.push(userData.email);
    }
    if (userData.age !== undefined) {
      updateFields.push("age = ?");
      updateValues.push(userData.age);
    }

    if (updateFields.length === 0) {
      return await this.findById(id);
    }

    updateValues.push(id);
    const query = `
      UPDATE users 
      SET ${updateFields.join(", ")} 
      WHERE id = ?
    `;

    await executeQuery(query, updateValues);
    return await this.findById(id);
  }

  // Delete user
  static async delete(id: number): Promise<boolean> {
    const query = "DELETE FROM users WHERE id = ?";
    const result = (await executeQuery(query, [id])) as any;
    return result.affectedRows > 0;
  }

  // Get users with pagination
  static async findWithPagination(
    page: number = 1,
    limit: number = 10
  ): Promise<{
    users: User[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    // Ensure page and limit are valid numbers
    const validPage = Math.max(1, Math.floor(page) || 1);
    const validLimit = Math.max(1, Math.min(100, Math.floor(limit) || 10));
    const offset = (validPage - 1) * validLimit;

    // Get total count
    const countQuery = "SELECT COUNT(*) as total FROM users";
    const countResult = (await executeQuery(countQuery)) as any[];
    const total = countResult[0].total;

    // Get users for current page
    const usersQuery = `
      SELECT id, name, email, age, created_at, updated_at 
      FROM users 
      ORDER BY created_at DESC 
      LIMIT ${validLimit} OFFSET ${offset}
    `;
    const users = (await executeQuery(usersQuery)) as User[];

    return {
      users,
      total,
      page: validPage,
      totalPages: Math.ceil(total / validLimit),
    };
  }
}
