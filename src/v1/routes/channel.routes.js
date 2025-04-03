import { Router } from "express";

import channelController from "../../controllers/channel.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/create", authMiddleware, channelController.createChannel);

router.get("/my-channels", authMiddleware, channelController.getAllMyChannels);

export default router;
