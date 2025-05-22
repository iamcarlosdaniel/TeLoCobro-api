import e, { Router } from "express";

import debtController from "../../controllers/debt.controller.js";

import { authenticationMiddleware } from "../../middlewares/authentication.middleware.js";
import { authorizationMiddleware } from "../../middlewares/authorization.middleware.js";
import { upload } from "../../middlewares/fileUpload.middleware.js";

const router = Router();

router.get(
  "/",
  authenticationMiddleware,
  authorizationMiddleware("user"),
  debtController.getAllDebts
);

router.put(
  "/:id",
  authenticationMiddleware,
  authorizationMiddleware("user"),
  debtController.updateDebtStatus
);

router.post(
  "/upload",
  authenticationMiddleware,
  authorizationMiddleware("user"),
  upload.single("file"),
  debtController.uploadDebts
);

export default router;
