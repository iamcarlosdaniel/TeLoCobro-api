import { Router } from "express";

import AuthController from "../../controllers/auth.controller.js";

const router = Router();

router.post("/sign-up", AuthController.signUp);

router.post("/confirm-account", AuthController.confirmAccount);

router.post("/sign-in", AuthController.signIn);

router.post("/sign-out", AuthController.signOut);

export default router;
