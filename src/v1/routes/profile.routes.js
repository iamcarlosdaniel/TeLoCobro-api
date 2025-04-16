import { Router } from "express";

import ProfileController from "../../controllers/profile.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

//TODO Revisar las dos primeras rutas
router.get("/", authMiddleware, ProfileController.getProfile);

router.put("/", authMiddleware, ProfileController.updateProfile);

router.post("/change-email", authMiddleware, ProfileController.changeEmail);

router.patch("/confirm-email", authMiddleware, ProfileController.confirmEmail);

router.post(
  "/change-password",
  authMiddleware,
  ProfileController.changePassword
);

export default router;
