import { Router } from "express";

import UserService from "../../controllers/user.controller.js";
import { userAuthMiddleware } from "../../middlewares/userAuth.middleware.js";

const router = Router();

router.get("/me", userAuthMiddleware, UserService.getProfile);

router.put("/me", userAuthMiddleware, UserService.updateProfile);

export default router;
