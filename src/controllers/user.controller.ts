import { Request, Response } from "express";
import UserService from "../services/user.service";
import { UserRole } from "../interfaces/user.interface";
import { Logger } from "../utils/logger.util";

export class UserController {
  private logger: Logger;

  constructor() {
    this.logger = new Logger("UserController");
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const role = req.query.role as UserRole | undefined;
      const users = await UserService.getAllUsers(role);

      res.status(200).json({
        message: "Users retrieved successfully",
        users,
      });
    } catch (error) {
      this.logger.error("Error retrieving users", error);
      res.status(500).json({
        message:
          error instanceof Error ? error.message : "Failed to retrieve users",
      });
    }
  }

  async getUserProfile(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const user = await UserService.getUserById(userId);

      res.status(200).json({
        message: "User profile retrieved successfully",
        user,
      });
    } catch (error) {
      this.logger.error("Error retrieving user profile", error);
      res.status(404).json({
        message: error instanceof Error ? error.message : "User not found",
      });
    }
  }

  async updateUserProfile(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const updateData = req.body;
    

      const updatedUser = await UserService.updateUser(userId, updateData);

      res.status(200).json({
        message: "User profile updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      this.logger.error("Error updating user profile", error);
      res.status(400).json({
        message:
          error instanceof Error ? error.message : "Failed to update profile",
      });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id}= req.params;

      if (!id) {
        res.status(400).json({ message: 'User ID is required' });
        return;
      }

      await UserService.deleteUser(id);

      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      this.logger.error('Error in deleting user', error);
      res.status(500).json({
        message: error instanceof Error ? error.message : 'Failed to delete user',
      });
    }
  }
}

export default new UserController();