// src/controllers/profile.controller.ts
// Fix: PUT /api/profile/update must validate userId, name, email
// and return 400 for missing fields, not 404

import { Request, Response } from "express";
import { UserModel } from "../models/user.model";

export class ProfileController {
  // GET /api/profile/:userId  — public
  async getProfile(req: Request, res: Response) {
    try {
      const user = await UserModel.findById(req.params.userId)
        .select("-password")
        .lean();

      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      const firstName = (user as any).firstName || "";
      const lastName  = (user as any).lastName  || "";
      const fullName  = [firstName, lastName].filter(Boolean).join(" ") || (user as any).username || "";

      return res.status(200).json({
        success: true,
        data: {
          id:    (user as any)._id?.toString() || (user as any).id,
          name:  fullName,
          email: (user as any).email,
          bio:   (user as any).bio   || "",
          phone: (user as any).phone || "",
          image: (user as any).profileImage || null,
        },
      });
    } catch (error: any) {
      console.error("❌ Get profile error:", error);
      return res.status(500).json({ success: false, message: "Failed to fetch profile" });
    }
  }

  // PUT /api/profile/update  — authenticated
  async updateProfile(req: Request, res: Response) {
    try {
      const { userId, name, email, bio, phone } = req.body;

      // ── Validation: return 400 for missing required fields ──
      if (!userId) {
        return res.status(400).json({ success: false, message: "userId is required" });
      }
      if (!name || name.trim() === "") {
        return res.status(400).json({ success: false, message: "name is required" });
      }
      if (!email || email.trim() === "") {
        return res.status(400).json({ success: false, message: "email is required" });
      }

      // ── Ownership check ──
      const authUser = (req as any).user;
      if (authUser && authUser.id !== userId && authUser._id?.toString() !== userId) {
        if (authUser.role !== "admin") {
          return res.status(403).json({ success: false, message: "Forbidden: you can only update your own profile" });
        }
      }

      // Split name into firstName / lastName
      const parts     = name.trim().split(" ");
      const firstName = parts[0] || "";
      const lastName  = parts.slice(1).join(" ") || "";

      const updates: Record<string, any> = {
        firstName,
        lastName,
        email: email.trim(),
      };
      if (bio  !== undefined) updates.bio   = bio;
      if (phone !== undefined) updates.phone = phone;

      if (req.file) {
        updates.profileImage = `/uploads/${req.file.filename}`;
      }

      const user = await UserModel.findByIdAndUpdate(
        userId,
        { $set: updates },
        { new: true }
      ).select("-password").lean();

      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      const updatedName = [(user as any).firstName, (user as any).lastName]
        .filter(Boolean).join(" ");

      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: {
          id:    (user as any)._id?.toString() || (user as any).id,
          name:  updatedName,
          email: (user as any).email,
          bio:   (user as any).bio   || "",
          phone: (user as any).phone || "",
          image: (user as any).profileImage || null,
        },
      });
    } catch (error: any) {
      console.error("❌ Update profile error:", error);
      return res.status(500).json({ success: false, message: "Failed to update profile" });
    }
  }
}

export const profileController = new ProfileController();