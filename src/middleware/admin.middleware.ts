// import { Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";
// import { UserType } from "../types/user.type";
// import { AuthenticatedRequest } from "./auth.middleware";

// // ✅ Step 1: Check if user is logged in (cookie-based)
// export const isAuthenticated = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
//   try {
//     // Read token from cookies
//     const token = req.cookies?.auth_token;

//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "No token provided. Please log in first.",
//       });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as UserType & { id: string };

//     req.user = decoded;

//     next();
//   } catch (error) {
//     console.error("Authentication error:", error);
//     return res.status(401).json({
//       success: false,
//       message: "Invalid or expired token. Please log in again.",
//     });
//   }
// };

// // ✅ Step 2: Check if user has admin role
// export const isAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
//   try {
//     const user = req.user;

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "User not found. Please log in again.",
//       });
//     }

//     if (user.role !== "admin") {
//       return res.status(403).json({
//         success: false,
//         message: "Access denied. Only admin can access this resource.",
//       });
//     }

//     next();
//   } catch (error) {
//     console.error("Admin check error:", error);
//     return res.status(403).json({
//       success: false,
//       message: "Access denied.",
//     });
//   }
// };


import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserType } from "../types/user.type";
import { AuthenticatedRequest } from "./auth.middleware";

// ✅ Step 1: Check if user is logged in (cookie-based OR header-based)
export const isAuthenticated = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;

    // ✅ First, try to get token from Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }

    // ✅ If not in header, try cookies
    if (!token) {
      token = req.cookies?.auth_token;
    }

    // ✅ If still no token, reject
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided. Please log in first.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as UserType & { id: string };

    req.user = decoded;

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please log in again.",
    });
  }
};

// ✅ Step 2: Check if user has admin role (no changes needed)
export const isAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found. Please log in again.",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only admin can access this resource.",
      });
    }

    next();
  } catch (error) {
    console.error("Admin check error:", error);
    return res.status(403).json({
      success: false,
      message: "Access denied.",
    });
  }
};