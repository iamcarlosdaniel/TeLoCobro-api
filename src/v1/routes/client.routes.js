import { Router } from "express";

import clientController from "../../controllers/client.controller.js";

import { authenticationMiddleware } from "../../middlewares/authentication.middleware.js";
import { authorizationMiddleware } from "../../middlewares/authorization.middleware.js";
import { upload } from "../../middlewares/fileUpload.middleware.js";

const router = Router();

//Rutas de acceso solamente para clientes
router.get(
  "/me",
  authenticationMiddleware,
  authorizationMiddleware("client"),
  clientController.getProfile
);

//Rutas de acceso solamente para usuarios
router.get(
  "/:id([0-9a-fA-F]{24})",
  authenticationMiddleware,
  authorizationMiddleware("user"),
  clientController.getMyClientById
);

router.get(
  "/",
  authenticationMiddleware,
  authorizationMiddleware("user"),
  clientController.getAllMyClients
);

router.post(
  "/upload",
  authenticationMiddleware,
  authorizationMiddleware("user"),
  upload.single("file"),
  clientController.uploadClients
);

export default router;
