// import { Request, Response } from "express";
// import { UserService } from "../service/user.service";

// let userService = new UserService();

// export class UploadController {
//   // Upload profile image and save to user profile
//   async uploadProfileImage(req: Request, res: Response) {
//     try {
//       if (!req.file) {
//         return res.status(400).json({
//           success: false,
//           message: "No image file provided",
//         });
//       }

//       // Get userId from request body
//       const userId = req.body.userId as string;

//       if (!userId) {
//         return res.status(400).json({
//           success: false,
//           message: "User ID is required",
//         });
//       }

//       // Get the uploaded file info
//       const imageUrl = `/uploads/${req.file.filename}`;

//       // Save image URL to user profile in MongoDB
//       const updatedUser = await userService.updateProfileImage(userId, imageUrl);

//       return res.status(200).json({
//         success: true,
//         message: "Profile image uploaded successfully",
//         data: {
//           user: updatedUser,
//           imageUrl: imageUrl,
//         },
//       });
//     } catch (error: any) {
//       return res.status(500).json({
//         success: false,
//         message: "Error uploading image",
//         error: error.message,
//       });
//     }
//   }

//   // Get user profile image
//   async getProfileImage(req: Request, res: Response) {
//     try {
//       const userId = req.params.userId as string;  // ← ADDED 'as string'

//       if (!userId) {
//         return res.status(400).json({
//           success: false,
//           message: "User ID is required",
//         });
//       }

//       const imageUrl = await userService.getUserProfileImage(userId);

//       return res.status(200).json({
//         success: true,
//         data: {
//           imageUrl: imageUrl,
//         },
//       });
//     } catch (error: any) {
//       return res.status(500).json({
//         success: false,
//         message: "Error fetching profile image",
//         error: error.message,
//       });
//     }
//   }
// }


// src/controllers/upload.controller.ts
// Fix: DELETE /api/upload/profile-image/:userId must return 200 
//      even if user has no image (not 404)
//      and must return 404/500 for non-existent user, not just any 404

import { Request, Response } from "express";
import { UserModel } from "../models/user.model";
import fs from "fs";
import path from "path";

export class UploadController {
  // GET /api/upload/profile-image/:userId
  async getProfileImage(req: Request, res: Response) {
    try {
      const user = await UserModel.findById(req.params.userId)
        .select("profileImage")
        .lean();

      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      return res.status(200).json({
        success: true,
        data: { imageUrl: (user as any).profileImage || null },
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // POST /api/upload/profile-image
  async uploadProfileImage(req: Request, res: Response) {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ success: false, message: "User ID is required" });
      }

      if (!req.file) {
        return res.status(400).json({ success: false, message: "No image file provided" });
      }

      const imageUrl = `/uploads/${req.file.filename}`;

      const user = await UserModel.findByIdAndUpdate(
        userId,
        { $set: { profileImage: imageUrl } },
        { new: true }
      ).select("-password").lean();

      if (!user) {
        // Clean up uploaded file if user doesn't exist
        try { fs.unlinkSync(req.file.path); } catch {}
        return res.status(404).json({ success: false, message: "User not found" });
      }

      return res.status(200).json({
        success: true,
        message: "Profile image uploaded successfully",
        data: { imageUrl },
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // DELETE /api/upload/profile-image/:userId
  // ✅ Returns 200 even if the user has no image (idempotent delete)
  // ✅ Returns 404/500 only if the user doesn't exist
  async deleteProfileImage(req: Request, res: Response) {
    try {
      const user = await UserModel.findById(req.params.userId)
        .select("profileImage")
        .lean();

      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      const existingImage = (user as any).profileImage;

      // If user has an image, delete the file from disk
      if (existingImage && existingImage.startsWith("/uploads/")) {
        const filePath = path.join(process.cwd(), existingImage);
        try {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (fileErr) {
          console.warn("Could not delete image file:", fileErr);
        }
      }

      // Always clear the profileImage field, even if it was already empty
      await UserModel.findByIdAndUpdate(
        req.params.userId,
        { $set: { profileImage: "" } }
      );

      return res.status(200).json({
        success: true,
        message: "Profile image deleted successfully",
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

export const uploadController = new UploadController();