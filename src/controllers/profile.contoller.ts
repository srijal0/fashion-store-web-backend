import { Response } from "express";
import { UserModel } from "../models/user.model";
import { AuthenticatedRequest } from "../middleware/auth.middleware";

export class ProfileController {
  // Update user profile
  async updateProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const { userId, name, email, bio, phone } = req.body;

      if (!userId || !name || !email) {
        return res.status(400).json({
          success: false,
          message: "userId, name, and email are required",
        });
      }

      const updateData: any = {
        email,
        bio: bio || null,
        phone: phone || null,
      };

      const nameParts = name.trim().split(" ");
      updateData.firstName = nameParts[0];
      updateData.lastName = nameParts.slice(1).join(" ") || "";

      if (req.file) {
        updateData.profileImage = `/uploads/${req.file.filename}`;
      }

      const updatedUser = await UserModel.findByIdAndUpdate(userId, updateData, {
        new: true,
        runValidators: true,
      });

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        imageUrl: updatedUser.profileImage,
        data: {
          id: updatedUser._id,
          name: `${updatedUser.firstName || ""} ${updatedUser.lastName || ""}`.trim(),
          email: updatedUser.email,
          bio: updatedUser.bio || null,
          phone: updatedUser.phone || null,
          image: updatedUser.profileImage,
          role: updatedUser.role,
        },
      });
    } catch (error: any) {
      console.error("❌ Profile update error:", error);

      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }

      return res.status(500).json({
        success: false,
        message: error.message || "Failed to update profile",
      });
    }
  }

  // Get user profile by userId
  async getProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const { userId } = req.params;

      const user = await UserModel.findById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          id: user._id,
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          email: user.email,
          bio: user.bio || null,
          phone: user.phone || null,
          image: user.profileImage,
          role: user.role,
        },
      });
    } catch (error: any) {
      console.error("❌ Get profile error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch profile",
      });
    }
  }

  // ✅ Get currently logged-in user's profile
  async getMyProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id; // now type-safe

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const user = await UserModel.findById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          id: user._id,
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          email: user.email,
          bio: user.bio || null,
          phone: user.phone || null,
          image: user.profileImage,
          role: user.role,
        },
      });
    } catch (error: any) {
      console.error("❌ Get my profile error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch profile",
      });
    }
  }
}
