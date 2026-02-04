// import { Request, Response } from "express";
// import { UserService } from "../service/user.service";
// import { CreateUserDTO, LoginUserDTO } from "../dtos/user.dto";
// import z from "zod";

// const userService = new UserService();

// export class AuthController {

//   register = async (req: Request, res: Response) => {
//     try {
//       console.log("REGISTER BODY:", req.body); // debug

//       const parsedData = CreateUserDTO.safeParse(req.body);
//       if (!parsedData.success) {
//         return res.status(400).json({
//           success: false,
//           message: z.prettifyError(parsedData.error),
//         });
//       }

//       const userData: CreateUserDTO = parsedData.data;
//       const newUser = await userService.createUser(userData);

//       return res.status(201).json({
//         success: true,
//         message: "User created",
//         data: newUser,
//       });

//     } catch (error: any) {
//       return res.status(error.status ?? 500).json({
//         success: false,
//         message: error.message ?? "Internal Server Error",
//       });
//     }
//   };

//   login = async (req: Request, res: Response) => {
//     try {
//       console.log("LOGIN BODY:", req.body); // debug

//       const parsedData = LoginUserDTO.safeParse(req.body);
//       if (!parsedData.success) {
//         return res.status(400).json({
//           success: false,
//           message: z.prettifyError(parsedData.error),
//         });
//       }

//       const userData: LoginUserDTO = parsedData.data;
//       const { token, user } = await userService.loginUser(userData);

//       return res.status(200).json({
//         success: true,
//         message: "Login successful",
//         data: user,
//         token,
//       });

//     } catch (error: any) {
//       return res.status(error.status ?? 500).json({
//         success: false,
//         message: error.message || "Internal Server Error",
//       });
//     }
//   };
// }


import { Request, Response } from "express";
import { UserService } from "../service/user.service";
import { CreateUserDTO, LoginUserDTO } from "../dtos/user.dto";
import { UserModel } from "../models/user.model";
import z from "zod";
import path from "path";
import fs from "fs";

const userService = new UserService();

export class AuthController {
  // Register user
  register = async (req: Request, res: Response) => {
    try {
      console.log("REGISTER BODY:", req.body); // debug

      const parsedData = CreateUserDTO.safeParse(req.body);
      if (!parsedData.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsedData.error),
        });
      }

      const userData: CreateUserDTO = parsedData.data;
      const newUser = await userService.createUser(userData);

      return res.status(201).json({
        success: true,
        message: "User created",
        data: newUser,
      });
    } catch (error: any) {
      return res.status(error.status ?? 500).json({
        success: false,
        message: error.message ?? "Internal Server Error",
      });
    }
  };

  // ✅ Fixed Login user
  login = async (req: Request, res: Response) => {
    try {
      console.log("LOGIN BODY:", req.body); // debug

      const parsedData = LoginUserDTO.safeParse(req.body);
      if (!parsedData.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsedData.error),
        });
      }

      const userData: LoginUserDTO = parsedData.data;
      const { token, user } = await userService.loginUser(userData);

      return res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        data: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,   // 👈 Added role explicitly
        },
      });
    } catch (error: any) {
      return res.status(error.status ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  };

  // Update user profile
  updateUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const currentUser = (req as any).user;

      if (currentUser.id !== id) {
        return res.status(403).json({
          success: false,
          message: "You can only update your own profile",
        });
      }

      const { firstName, lastName, email, bio, phone, removeImage } = req.body;

      const existingUser = await UserModel.findById(id);
      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      if (email && email !== existingUser.email) {
        const emailExists = await UserModel.findOne({ email });
        if (emailExists) {
          return res.status(400).json({
            success: false,
            message: "Email already exists",
          });
        }
      }

      const updateData: any = {};
      if (firstName !== undefined) updateData.firstName = firstName;
      if (lastName !== undefined) updateData.lastName = lastName;
      if (email) updateData.email = email;
      if (bio !== undefined) updateData.bio = bio || null;
      if (phone !== undefined) updateData.phone = phone || null;

      if (removeImage === "true") {
        if (existingUser.profileImage) {
          const oldImagePath = path.join(process.cwd(), existingUser.profileImage);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
            console.log("🗑️ Old image deleted:", oldImagePath);
          }
        }
        updateData.profileImage = "";
      }

      if (req.file) {
        if (existingUser.profileImage) {
          const oldImagePath = path.join(process.cwd(), existingUser.profileImage);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
            console.log("🗑️ Old image deleted:", oldImagePath);
          }
        }
        updateData.profileImage = `/uploads/${req.file.filename}`;
      }

      const updatedUser = await UserModel.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });

      console.log("✅ User updated:", updatedUser?.email);

      return res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: {
          id: updatedUser?._id,
          username: updatedUser?.username,
          email: updatedUser?.email,
          firstName: updatedUser?.firstName,
          lastName: updatedUser?.lastName,
          bio: updatedUser?.bio,
          phone: updatedUser?.phone,
          role: updatedUser?.role,
          profileImage: updatedUser?.profileImage,
        },
      });
    } catch (error: any) {
      console.error("❌ Update user error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to update user",
      });
    }
  };
}
