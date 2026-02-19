// import { Router } from "express";
//  // Fixed: was profile.contoller (typo)
// import { upload } from "../middleware/upload.middleware";
// import { isAuthenticated } from "../middleware/admin.middleware"; // Or your auth middleware
// import { ProfileController } from "../controllers/profile.contoller";

// const profileController = new ProfileController();
// const router = Router();

// // POST route to update profile (with optional image)
// // IMPORTANT: Add authentication middleware to ensure user is logged in
// router.post(
//   "/update",
//   isAuthenticated, // Add your authentication middleware
//   upload.single("image"), // This will handle the image file
//   profileController.updateProfile
// );

// // GET route to get user profile by userId
// router.get("/:userId", profileController.getProfile);

// export default router;

// src/routes/profile.routes.ts
// Tests call: PUT /api/profile/update  (not POST, not PATCH)
// Make sure this route exists with PUT method

import { Router } from "express";

import { isAuthenticated } from "../middleware/admin.middleware";
import multer from "multer";
import path from "path";
import { profileController } from "../controllers/profile.contoller";

const router = Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, "uploads/"),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${file.originalname}`;
    cb(null, unique);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  },
});

// GET /api/profile/:userId  — public, no auth needed
router.get("/:userId", profileController.getProfile.bind(profileController));

// PUT /api/profile/update   — authenticated
// ⚠️  Must be PUT (tests use .put()), must be /update (not /:userId)
router.put(
  "/update",
  isAuthenticated,
  upload.single("image"),
  profileController.updateProfile.bind(profileController)
);

export default router;