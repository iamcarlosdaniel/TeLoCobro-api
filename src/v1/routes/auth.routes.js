import { Router } from "express";

import AuthController from "../../controllers/auth.controller.js";

import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { inputValidation } from "../../middlewares/inputValidation.middleware.js";

import {
  signUpSchema,
  confirmAccountSchema,
  signInSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../../database/schemas/auth.schema.js";

const router = Router();

router.post("/sign-up", inputValidation(signUpSchema), AuthController.signUp);

//!No disponible por el momento
//router.post("/phone-number/confirm", AuthController.confirmPhoneNumber);

router.post(
  "/sign-up/confirm",
  inputValidation(confirmAccountSchema),
  AuthController.confirmAccount
);

router.post("/sign-in", inputValidation(signInSchema), AuthController.signIn);

router.post(
  "/password/forgot",
  inputValidation(forgotPasswordSchema),
  AuthController.forgotPassword
);

router.post(
  "/password/reset",
  inputValidation(resetPasswordSchema),
  AuthController.resetPassword
);

router.get("/status", authMiddleware, AuthController.authStatus);

router.post("/sign-out", authMiddleware, AuthController.signOut);

export default router;
