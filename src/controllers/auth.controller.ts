import { Request, Response } from "express";
import AuthService from "../services/auth.service";
import { UserRole } from "../interfaces/user.interface";
import { Logger } from "../utils/logger.util";

export class AuthController {
  private logger: Logger;

  constructor() {
    this.logger = new Logger("AuthController");
  }

  async register(req: Request, res: Response) {
    try {
      console.log(req.body);
      const { username, email, password, role } = req.body;

      const user = await AuthService.register({
        username,
        email,
        password,
        role: role || UserRole.USER,
      });
      console.log(user);

      res.status(201).json({
        message: "User registered successfully",
        user,
      });
    } catch (error) {
      this.logger.error("Registration error", error);
      res.status(400).json({
        message: error instanceof Error ? error.message : "Registration failed",
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const { user, token } = await AuthService.login(email, password);

      res.status(200).json({
        message: "Login successful",
        user,
        token,
      });
    } catch (error) {
      this.logger.error("Login error", error);
      res.status(401).json({
        message: error instanceof Error ? error.message : "Login failed",
      });
    }
  }

}

export default new AuthController();
