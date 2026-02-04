//for mobile
//// import { Router } from "express";
// import { AuthController } from "../controllers/auth.controller";

// let authController = new AuthController();
// const router = Router();

// router.post("/login", authController.login);
// router.post("/register", authController.register);

// export default router;


//for web
import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { isAuthenticated } from "../middleware/admin.middleware";
import { upload } from "../middleware/upload.middleware";


let authController = new AuthController();
const router = Router();

// ✅ Existing routes (not changed)
router.post("/login", authController.login);
router.post("/register", authController.register);

// ✅ NEW: Update user profile with optional image
// PUT /api/auth/:id
router.put("/:id", isAuthenticated, upload.single("image"), authController.updateUser);
//ajha ko
// router.post("/reset-password/:token", authController.resetPassword);

export default router;