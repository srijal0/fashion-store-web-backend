// import { Router } from "express";
// import { UploadController } from "../controllers/upload.controller";
// import { upload } from "../middleware/upload.middleware";

// let uploadController = new UploadController();
// const router = Router();

// // POST route to upload profile image
// router.post("/profile-image", upload.single("image"), uploadController.uploadProfileImage);

// // GET route to get user profile image
// router.get("/profile-image/:userId", uploadController.getProfileImage);

// export default router;

// src/routes/upload.routes.ts

import { Router } from "express";
import { uploadController } from "../controllers/upload.controller";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
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

// GET /api/upload/profile-image/:userId
router.get(
  "/profile-image/:userId",
  uploadController.getProfileImage.bind(uploadController)
);

// POST /api/upload/profile-image
router.post(
  "/profile-image",
  upload.single("image"),
  uploadController.uploadProfileImage.bind(uploadController)
);

// DELETE /api/upload/profile-image/:userId
// Returns 200 even if user has no image (idempotent)
router.delete(
  "/profile-image/:userId",
  uploadController.deleteProfileImage.bind(uploadController)
);

export default router;