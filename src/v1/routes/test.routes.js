import { Router } from "express";

import TestController from "../../controllers/test.controller.js";
import upload from "../../middlewares/fileUpload.middleware.js";

const router = Router();

router.post("/read-csv", upload.single("file"), TestController.readCSV);

router.get("/ip", TestController.getIpInfo);

export default router;
