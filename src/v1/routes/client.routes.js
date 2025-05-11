import { Router } from "express";

import clientController from "../../controllers/client.controller.js";

import { userAuthMiddleware } from "../../middlewares/userAuth.middleware.js";
import { upload } from "../../middlewares/fileUpload.middleware.js";

const router = Router();

router.get("/:id", userAuthMiddleware, clientController.getMyClientById);

router.get("/", userAuthMiddleware, clientController.getAllMyClients);

router.post(
  "/upload",
  userAuthMiddleware,
  upload.single("file"),
  clientController.uploadClients
);

export default router;
