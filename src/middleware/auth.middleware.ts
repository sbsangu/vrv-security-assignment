import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config/serverConfig";
import { Logger } from "../utils/logger.util";
import { ROLE_PERMISSIONS } from "../interfaces/permission.interface";
import { AuthPayload } from "../interfaces/user.interface";

// Extend Express Request to include `user`
declare global {
  namespace Express {
    interface Request {
      user: AuthPayload;
    }
  }
}

export class AuthMiddleware {
  private logger: Logger;

  constructor() {
    this.logger = new Logger("AuthMiddleware");
  }

  authenticate = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "No token provided" });
      return;
    }

    const token = authHeader.split(" ")[1];
    const secretKey = config.JWT_SECRET_KEY || "default-secret-key";

    try {
      const decoded = jwt.verify(token, secretKey) as AuthPayload;

      if (!decoded) {
        throw new Error("Token decoding failed");
      }

      req.user = decoded; // Assigning the decoded payload to the user object
      next();
    } catch (error: any) {
      this.logger.error("Token verification failed", error);
      res.status(401).json({ message: "Invalid or expired token" });
    }
  };

  authorize = (
    requiredPermission: string,
    resource: string,
    allowedRoles: string[] = []
  ): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction): void => {
      try {
        const userRole = req.user?.role;
        console.log(userRole);

        if (!userRole) {
          res.status(401).json({ message: "Unauthorized: No role found" });
          return;
        }
        console.log(allowedRoles);

        if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
          res.status(403).json({ message: "Access denied: Role not allowed" });
          return;
        } 


        const rolePermissions =
          ROLE_PERMISSIONS[userRole as keyof typeof ROLE_PERMISSIONS];
          
          console.log(rolePermissions);

        if (!rolePermissions) {
          res.status(403).json({ message: "Access denied: No permissions" });
          return;
        }

        const resourcePermissions = rolePermissions.find(
          (permission) => permission.resource === resource
        );
        console.log(resourcePermissions);

        if (
          !resourcePermissions ||
          !resourcePermissions.actions.includes(requiredPermission)
        ) {
          res.status(403).json({ message: "Access denied: Permission not found" });
          return;
        }

        next();
      } catch (error: any) {
        this.logger.error("Authorization error", error);
        res
          .status(500)
          .json({ message: "Internal server error", error: error.message });
      }
    };
  };
}

export default new AuthMiddleware();
