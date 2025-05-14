import { Router } from "express";

import userController from "../../controllers/user.controller.js";
import { authenticationMiddleware } from "../../middlewares/authentication.middleware.js";
import { authorizationMiddleware } from "../../middlewares/authorization.middleware.js";

const router = Router();

router.get(
  "/me",
  authenticationMiddleware,
  authorizationMiddleware("user"),
  userController.getProfile
);

router.put(
  "/me",
  authenticationMiddleware,
  authorizationMiddleware("user"),
  userController.updateProfile
);

export default router;
