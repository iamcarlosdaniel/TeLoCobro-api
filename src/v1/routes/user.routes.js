import { Router } from "express";

import UserController from "../../controllers/user.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/user/:id", authMiddleware, UserController.getUserById);

router.patch();

export default router;
