import { Router } from "express";

import UserService from "../../controllers/user.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/me", authMiddleware, UserService.getProfile);

router.patch("/me", authMiddleware, UserService.updateProfile);

router.post("/me/email", authMiddleware, UserService.changeEmail);

router.post("/me/email/confirm", authMiddleware, UserService.confirmEmail);

router.patch("/me/password", authMiddleware, UserService.changePassword);

export default router;
