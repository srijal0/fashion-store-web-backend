// for mobile
// import { Request, Response } from "express";
// import { UserModel } from "../models/user.model";
// import path from "path";
// import fs from "fs";
// import bcrypt from "bcryptjs";

// export class AdminController {

//   // ✅ 1. CREATE A NEW USER
//   // POST /api/admin/users
//   async createUser(req: Request, res: Response) {
//     try {
//       const { username, email, password, firstName, lastName, role } = req.body;

//       // Validate required fields
//       if (!username || !email || !password) {
//         return res.status(400).json({
//           success: false,
//           message: "Username, email, and password are required",
//         });
//       }

//       // Check if email already exists
//       const existingUser = await UserModel.findOne({ email });
//       if (existingUser) {
//         return res.status(400).json({
//           success: false,
//           message: "Email already exists",
//         });
//       }

//       // Check if username already exists
//       const existingUsername = await UserModel.findOne({ username });
//       if (existingUsername) {
//         return res.status(400).json({
//           success: false,
//           message: "Username already exists",
//         });
//       }

//       // Hash the password before saving
//       const salt = await bcrypt.genSalt(10);
//       const hashedPassword = await bcrypt.hash(password, salt);

//       // Prepare user data
//       const userData: any = {
//         username,
//         email,
//         password: hashedPassword,
//         firstName: firstName || "",
//         lastName: lastName || "",
//         role: role || "user", // Default role is "user"
//       };

//       // If image was uploaded, add it
//       if (req.file) {
//         userData.profileImage = `/uploads/${req.file.filename}`;
//       }

//       // Create user in database
//       const newUser = await UserModel.create(userData);

//       console.log("✅ User created:", newUser.email);

//       // Return success (don't return password)
//       return res.status(201).json({
//         success: true,
//         message: "User created successfully",
//         data: {
//           id: newUser._id,
//           username: newUser.username,
//           email: newUser.email,
//           firstName: newUser.firstName,
//           lastName: newUser.lastName,
//           role: newUser.role,
//           profileImage: newUser.profileImage,
//         },
//       });
//     } catch (error: any) {
//       console.error("❌ Create user error:", error);
//       return res.status(500).json({
//         success: false,
//         message: error.message || "Failed to create user",
//       });
//     }
//   }

//   // ✅ 2. GET ALL USERS
//   // GET /api/admin/users
//   async getAllUsers(req: Request, res: Response) {
//     try {
//       // Fetch all users, but don't return the password field
//       const users = await UserModel.find().select("-password").sort({ createdAt: -1 });

//       return res.status(200).json({
//         success: true,
//         message: "Users fetched successfully",
//         count: users.length,
//         data: users.map((user) => ({
//           id: user._id,
//           username: user.username,
//           email: user.email,
//           firstName: user.firstName,
//           lastName: user.lastName,
//           role: user.role,
//           profileImage: user.profileImage,
//           createdAt: user.createdAt,
//           updatedAt: user.updatedAt,
//         })),
//       });
//     } catch (error: any) {
//       console.error("❌ Get all users error:", error);
//       return res.status(500).json({
//         success: false,
//         message: error.message || "Failed to fetch users",
//       });
//     }
//   }

//   // ✅ 3. GET SINGLE USER BY ID
//   // GET /api/admin/users/:id
//   async getUserById(req: Request, res: Response) {
//     try {
//       const { id } = req.params;

//       // Find user by ID, don't return password
//       const user = await UserModel.findById(id).select("-password");

//       if (!user) {
//         return res.status(404).json({
//           success: false,
//           message: "User not found",
//         });
//       }

//       return res.status(200).json({
//         success: true,
//         data: {
//           id: user._id,
//           username: user.username,
//           email: user.email,
//           firstName: user.firstName,
//           lastName: user.lastName,
//           bio: user.bio,
//           phone: user.phone,
//           role: user.role,
//           profileImage: user.profileImage,
//           createdAt: user.createdAt,
//           updatedAt: user.updatedAt,
//         },
//       });
//     } catch (error: any) {
//       console.error("❌ Get user by ID error:", error);
//       return res.status(500).json({
//         success: false,
//         message: error.message || "Failed to fetch user",
//       });
//     }
//   }

//   // ✅ 4. UPDATE USER BY ID
//   // PUT /api/admin/users/:id
//   async updateUser(req: Request, res: Response) {
//     try {
//       const { id } = req.params;
//       const { username, email, firstName, lastName, role, bio, phone, removeImage } = req.body;

//       // Check if user exists
//       const existingUser = await UserModel.findById(id);
//       if (!existingUser) {
//         return res.status(404).json({
//           success: false,
//           message: "User not found",
//         });
//       }

//       // If email is being changed, check if new email already exists
//       if (email && email !== existingUser.email) {
//         const emailExists = await UserModel.findOne({ email });
//         if (emailExists) {
//           return res.status(400).json({
//             success: false,
//             message: "Email already exists",
//           });
//         }
//       }

//       // If username is being changed, check if new username already exists
//       if (username && username !== existingUser.username) {
//         const usernameExists = await UserModel.findOne({ username });
//         if (usernameExists) {
//           return res.status(400).json({
//             success: false,
//             message: "Username already exists",
//           });
//         }
//       }

//       // Prepare update data
//       const updateData: any = {};

//       if (username) updateData.username = username;
//       if (email) updateData.email = email;
//       if (firstName !== undefined) updateData.firstName = firstName;
//       if (lastName !== undefined) updateData.lastName = lastName;
//       if (role) updateData.role = role;
//       if (bio !== undefined) updateData.bio = bio || null;
//       if (phone !== undefined) updateData.phone = phone || null;

//       // Handle image removal
//       if (removeImage === "true") {
//         // Delete old image file from disk if exists
//         if (existingUser.profileImage) {
//           const oldImagePath = path.join(process.cwd(), existingUser.profileImage);
//           if (fs.existsSync(oldImagePath)) {
//             fs.unlinkSync(oldImagePath);
//             console.log("🗑️ Old image deleted:", oldImagePath);
//           }
//         }
//         updateData.profileImage = "";
//       }

//       // Handle new image upload
//       if (req.file) {
//         // Delete old image file from disk if exists
//         if (existingUser.profileImage) {
//           const oldImagePath = path.join(process.cwd(), existingUser.profileImage);
//           if (fs.existsSync(oldImagePath)) {
//             fs.unlinkSync(oldImagePath);
//             console.log("🗑️ Old image deleted:", oldImagePath);
//           }
//         }
//         updateData.profileImage = `/uploads/${req.file.filename}`;
//       }

//       // Update user in database
//       const updatedUser = await UserModel.findByIdAndUpdate(id, updateData, {
//         new: true,
//         runValidators: true,
//       });

//       console.log("✅ User updated:", updatedUser?.email);

//       return res.status(200).json({
//         success: true,
//         message: "User updated successfully",
//         data: {
//           id: updatedUser?._id,
//           username: updatedUser?.username,
//           email: updatedUser?.email,
//           firstName: updatedUser?.firstName,
//           lastName: updatedUser?.lastName,
//           bio: updatedUser?.bio,
//           phone: updatedUser?.phone,
//           role: updatedUser?.role,
//           profileImage: updatedUser?.profileImage,
//           createdAt: updatedUser?.createdAt,
//           updatedAt: updatedUser?.updatedAt,
//         },
//       });
//     } catch (error: any) {
//       console.error("❌ Update user error:", error);
//       return res.status(500).json({
//         success: false,
//         message: error.message || "Failed to update user",
//       });
//     }
//   }

//   // ✅ 5. DELETE USER BY ID
//   // DELETE /api/admin/users/:id
//   async deleteUser(req: Request, res: Response) {
//     try {
//       const { id } = req.params;

//       // Don't allow deleting yourself
//       const currentUser = (req as any).user;
//       if (currentUser.id === id) {
//         return res.status(400).json({
//           success: false,
//           message: "You cannot delete your own account",
//         });
//       }

//       // Find user first to get image path
//       const user = await UserModel.findById(id);
//       if (!user) {
//         return res.status(404).json({
//           success: false,
//           message: "User not found",
//         });
//       }

//       // Delete user's image file from disk if exists
//       if (user.profileImage) {
//         const imagePath = path.join(process.cwd(), user.profileImage);
//         if (fs.existsSync(imagePath)) {
//           fs.unlinkSync(imagePath);
//           console.log("🗑️ User image deleted:", imagePath);
//         }
//       }

//       // Delete user from database
//       await UserModel.findByIdAndDelete(id);

//       console.log("✅ User deleted:", user.email);

//       return res.status(200).json({
//         success: true,
//         message: "User deleted successfully",
//       });
//     } catch (error: any) {
//       console.error("❌ Delete user error:", error);
//       return res.status(500).json({
//         success: false,
//         message: error.message || "Failed to delete user",
//       });
//     }
//   }
// }


import { Request, Response } from "express";
import { UserModel } from "../models/user.model";
import path from "path";
import fs from "fs";
import bcrypt from "bcryptjs";

export class AdminController {

  // ✅ 1. CREATE A NEW USER
  // POST /api/admin/users
  async createUser(req: Request, res: Response) {
    try {
      const { username, email, password, firstName, lastName, role } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "Username, email, and password are required",
        });
      }

      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }

      const existingUsername = await UserModel.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({
          success: false,
          message: "Username already exists",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const userData: any = {
        username,
        email,
        password: hashedPassword,
        firstName: firstName || "",
        lastName: lastName || "",
        role: role || "user",
      };

      if (req.file) {
        userData.profileImage = `/uploads/${req.file.filename}`;
      }

      const newUser = await UserModel.create(userData);

      return res.status(201).json({
        success: true,
        message: "User created successfully",
        data: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          role: newUser.role,
          profileImage: newUser.profileImage,
        },
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to create user",
      });
    }
  }

  // ✅ 2. GET ALL USERS WITH PAGINATION (UPDATED)
  // GET /api/admin/users?page=1&limit=10
  async getAllUsers(req: Request, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const users = await UserModel.find()
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const totalUsers = await UserModel.countDocuments();

      return res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        pagination: {
          totalUsers,
          page,
          limit,
          totalPages: Math.ceil(totalUsers / limit),
        },
        data: users.map((user) => ({
          id: user._id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          profileImage: user.profileImage,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        })),
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch users",
      });
    }
  }

  // ✅ 3. GET SINGLE USER BY ID
  // GET /api/admin/users/:id
  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const user = await UserModel.findById(id).select("-password");

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
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          bio: user.bio,
          phone: user.phone,
          role: user.role,
          profileImage: user.profileImage,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch user",
      });
    }
  }

  // ✅ 4. UPDATE USER BY ID
  // PUT /api/admin/users/:id
  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { username, email, firstName, lastName, role, bio, phone, removeImage } = req.body;

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

      if (username && username !== existingUser.username) {
        const usernameExists = await UserModel.findOne({ username });
        if (usernameExists) {
          return res.status(400).json({
            success: false,
            message: "Username already exists",
          });
        }
      }

      const updateData: any = {};

      if (username) updateData.username = username;
      if (email) updateData.email = email;
      if (firstName !== undefined) updateData.firstName = firstName;
      if (lastName !== undefined) updateData.lastName = lastName;
      if (role) updateData.role = role;
      if (bio !== undefined) updateData.bio = bio || null;
      if (phone !== undefined) updateData.phone = phone || null;

      if (removeImage === "true") {
        if (existingUser.profileImage) {
          const oldImagePath = path.join(process.cwd(), existingUser.profileImage);
          if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
        }
        updateData.profileImage = "";
      }

      if (req.file) {
        if (existingUser.profileImage) {
          const oldImagePath = path.join(process.cwd(), existingUser.profileImage);
          if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
        }
        updateData.profileImage = `/uploads/${req.file.filename}`;
      }

      const updatedUser = await UserModel.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });

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
          createdAt: updatedUser?.createdAt,
          updatedAt: updatedUser?.updatedAt,
        },
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to update user",
      });
    }
  }

  // ✅ 5. DELETE USER BY ID
  // DELETE /api/admin/users/:id
  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const currentUser = (req as any).user;
      if (currentUser.id === id) {
        return res.status(400).json({
          success: false,
          message: "You cannot delete your own account",
        });
      }

      const user = await UserModel.findById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      if (user.profileImage) {
        const imagePath = path.join(process.cwd(), user.profileImage);
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
      }

      await UserModel.findByIdAndDelete(id);

      return res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to delete user",
      });
    }
  }
}
