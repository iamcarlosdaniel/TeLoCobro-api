import { Router } from "express";

import companyController from "../../controllers/company.controller.js";

import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/me", authMiddleware, companyController.getMyCompany);

router.post("/", authMiddleware, companyController.createCompany);

router.put("/", authMiddleware, companyController.updateCompany);

router.put("/activate", authMiddleware, companyController.activateCompany);

router.put("/desactivate", authMiddleware, companyController.deactivateCompany);

export default router;
