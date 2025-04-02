import { Router } from "express";

import AuthController from "../../controllers/auth.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/sign-up", AuthController.signUp);

router.post("/confirm-account", AuthController.confirmAccount);

router.post("/sign-in", AuthController.signIn);

router.post("/forgot-password", AuthController.forgotPassword);

router.post("/reset-password", AuthController.resetPassword);

router.get("/status", authMiddleware, AuthController.authStatus);

router.post("/sign-out", AuthController.signOut);

export default router;
