import devController from "../../controllers/dev.controller.js";

import { Router } from "express";

const devRouter = Router();

devRouter.get("/", devController.getDevConfig);
devRouter.put("/:devId", devController.updateDevConfig);
devRouter.delete("/:devId", devController.deleteDevConfig);

export default devRouter;
