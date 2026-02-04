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

import { Router } from "express";
import { ProfileController } from "../controllers/profile.contoller";
import { upload } from "../middleware/upload.middleware";
import { isAuthenticated } from "../middleware/admin.middleware"; // ✅ middleware to ensure user is logged in

const profileController = new ProfileController();
const router = Router();

// ✅ GET route to fetch currently logged-in user's profile
router.get("/", isAuthenticated, profileController.getMyProfile.bind(profileController));

// ✅ POST route to update profile (with optional image)
router.post("/update", upload.single("image"), profileController.updateProfile.bind(profileController));

// ✅ GET route to get user profile by userId
router.get("/:userId", profileController.getProfile.bind(profileController));

export default router;
