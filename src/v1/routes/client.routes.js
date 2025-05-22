import { Router } from "express";

import clientController from "../../controllers/client.controller.js";
import debtController from "../../controllers/debt.controller.js";

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

router.get(
  "/me/debts",
  authenticationMiddleware,
  authorizationMiddleware("client"),
  debtController.getAllMyDebts
);

router.get(
  "/me/debts/:id([0-9a-fA-F]{24})",
  authenticationMiddleware,
  authorizationMiddleware("client"),
  debtController.getMyDebtById
);

router.get(
  "/me/debts/:id([0-9a-fA-F]{24})/search",
  authenticationMiddleware,
  authorizationMiddleware("client"),
  debtController.getMyDebtsByStatus
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

//Rutas de acceso para las deudas de los clientes
router.get(
  "/:id([0-9a-fA-F]{24})/debts",
  authenticationMiddleware,
  authorizationMiddleware("user"),
  debtController.getClientDebtsById
);

router.get(
  "/:id([0-9a-fA-F]{24})/debts/search",
  authenticationMiddleware,
  authorizationMiddleware("user"),
  debtController.getClientDebtsByStatus
);
export default router;
