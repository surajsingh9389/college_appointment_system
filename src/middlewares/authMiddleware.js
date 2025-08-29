import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

// Middleware factory function
export const authMiddleware = (roles = []) => {
  // Ensure roles is always an array
  if (typeof roles === "string") roles = [roles];

  return async (req, res, next) => {
    try {
      // Get token from Authorization header: "Bearer <token>"
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) return res.status(401).json({ message: "No token provided" });

      // Verify JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user by ID stored in token payload
      const user = await User.findById(decoded.id);
      if (!user) return res.status(401).json({ message: "Invalid token" });

      // Role-based access control (if roles are specified)
      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({ message: "Forbidden: Access denied" });
      }

      // Attach user object to request
      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  };
};
