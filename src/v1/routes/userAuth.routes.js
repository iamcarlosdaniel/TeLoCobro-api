import { Router } from "express";

import UserAuthController from "../../controllers/userAuth.controller.js";

import { userAuthMiddleware } from "../../middlewares/userAuth.middleware.js";
import { inputValidation } from "../../middlewares/inputValidation.middleware.js";

import {
  signUpSchema,
  confirmAccountSchema,
  signInSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../../database/schemas/userAuth.schema.js";

const router = Router();

router.post(
  "/sign-up",
  inputValidation(signUpSchema),
  UserAuthController.signUp
);

router.post(
  "/sign-up/confirm",
  inputValidation(confirmAccountSchema),
  UserAuthController.confirmAccount
);

router.post(
  "/sign-in",
  inputValidation(signInSchema),
  UserAuthController.signIn
);

router.post(
  "/password/forgot",
  inputValidation(forgotPasswordSchema),
  UserAuthController.forgotPassword
);

router.post(
  "/password/reset",
  inputValidation(resetPasswordSchema),
  UserAuthController.resetPassword
);

router.get("/status", userAuthMiddleware, UserAuthController.authStatus);

router.post("/sign-out", userAuthMiddleware, UserAuthController.signOut);

export default router;
