import { Router } from "express";

import companyController from "../../controllers/company.controller.js";

import { authenticationMiddleware } from "../../middlewares/authentication.middleware.js";
import { authorizationMiddleware } from "../../middlewares/authorization.middleware.js";

const router = Router();

router.get(
  "/",
  authenticationMiddleware,
  authorizationMiddleware("user"),
  companyController.getMyCompany
);

router.post(
  "/",
  authenticationMiddleware,
  authorizationMiddleware("user"),
  companyController.createCompany
);

router.put(
  "/",
  authenticationMiddleware,
  authorizationMiddleware("user"),
  companyController.updateCompany
);

export default router;
