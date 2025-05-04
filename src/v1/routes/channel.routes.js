import { Router } from "express";

import channelController from "../../controllers/channel.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/me", authMiddleware, channelController.getMyChannel);
router.put("/activate", authMiddleware, channelController.activateMyChannel);
router.put(
  "/desactivate",
  authMiddleware,
  channelController.deactivateMyChannel
);
export default router;
