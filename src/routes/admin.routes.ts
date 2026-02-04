// import { Router } from "express";
// import { AdminController } from "../controllers/admin.controller";
// import { isAuthenticated, isAdmin } from "../middleware/admin.middleware";
// import { upload } from "../middleware/upload.middleware";

// const router = Router();
// const adminController = new AdminController();

// // POST /api/admin/users
// router.post(
//   "/users",
//   isAuthenticated,
//   isAdmin,
//   upload.single("image"),
//   adminController.createUser
// );

// // GET /api/admin/users
// router.get(
//   "/users",
//   isAuthenticated,
//   isAdmin,
//   adminController.getAllUsers
// );

// // GET /api/admin/users/:id
// router.get(
//   "/users/:id",
//   isAuthenticated,
//   isAdmin,
//   adminController.getUserById
// );

// // PUT /api/admin/users/:id
// router.put(
//   "/users/:id",
//   isAuthenticated,
//   isAdmin,
//   upload.single("image"),
//   adminController.updateUser
// );

// // DELETE /api/admin/users/:id
// router.delete(
//   "/users/:id",
//   isAuthenticated,
//   isAdmin,
//   adminController.deleteUser
// );

// export default router;


import { Router, Response } from "express";
import { AdminController } from "../controllers/admin.controller";
import { isAuthenticated, isAdmin } from "../middleware/admin.middleware";
import { upload } from "../middleware/upload.middleware";
import { AuthenticatedRequest } from "../middleware/auth.middleware";

const router = Router();
const adminController = new AdminController();

// ✅ Admin Dashboard route
router.get(
  "/dashboard",
  isAuthenticated,
  isAdmin,
  (req: AuthenticatedRequest, res: Response) => {
    res.json({
      success: true,
      message: "Welcome to Admin Dashboard",
      user: req.user,
    });
  }
);

// ✅ User management routes
router.post("/users", isAuthenticated, isAdmin, upload.single("image"), adminController.createUser);
router.get("/users", isAuthenticated, isAdmin, adminController.getAllUsers);
router.get("/users/:id", isAuthenticated, isAdmin, adminController.getUserById);
router.put("/users/:id", isAuthenticated, isAdmin, upload.single("image"), adminController.updateUser);
router.delete("/users/:id", isAuthenticated, isAdmin, adminController.deleteUser);

export default router;
