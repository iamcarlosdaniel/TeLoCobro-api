import { Router } from "express";

import companyController from "../../controllers/company.controller.js";

import { userAuthMiddleware } from "../../middlewares/userAuth.middleware.js";

const router = Router();

router.get("/", userAuthMiddleware, companyController.getMyCompany);

router.post("/", userAuthMiddleware, companyController.createCompany);

router.put("/", userAuthMiddleware, companyController.updateCompany);

export default router;
