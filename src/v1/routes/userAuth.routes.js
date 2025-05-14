import { Router } from "express";

import UserAuthController from "../../controllers/userAuth.controller.js";

import { authenticationMiddleware } from "../../middlewares/authentication.middleware.js";
import { authorizationMiddleware } from "../../middlewares/authorization.middleware.js";
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

router.get(
  "/status",
  authenticationMiddleware,
  authorizationMiddleware("user"),
  UserAuthController.authStatus
);

router.post(
  "/sign-out",
  authenticationMiddleware,
  authorizationMiddleware("user"),
  UserAuthController.signOut
);

export default router;
