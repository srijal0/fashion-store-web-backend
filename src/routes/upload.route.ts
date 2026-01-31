import { Router } from "express";
import { UploadController } from "../controllers/upload.controller";
import { upload } from "../middleware/upload.middleware";

let uploadController = new UploadController();
const router = Router();

// POST route to upload profile image
router.post("/profile-image", upload.single("image"), uploadController.uploadProfileImage);

// GET route to get user profile image
router.get("/profile-image/:userId", uploadController.getProfileImage);

export default router;
