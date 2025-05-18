import { Router } from "express";

import { authenticationMiddleware } from "../../middlewares/authentication.middleware.js";
import { authorizationMiddleware } from "../../middlewares/authorization.middleware.js";

import clientAuthController from "../../controllers/clientAuth.controller.js";

const router = Router();

router.get("/companies", clientAuthController.getCompaniesWithMyEmail);

router.post("/access/request/:id", clientAuthController.requestAccess);

router.post("/sign-in/:id", clientAuthController.signIn);

router.get(
  "/status",
  authenticationMiddleware,
  authorizationMiddleware("client"),
  clientAuthController.authStatus
);

router.post(
  "/sign-out",
  authenticationMiddleware,
  authorizationMiddleware("client"),
  clientAuthController.signOut
);

export default router;
