import { Router } from "express";

import LocationController from "../../controllers/location.controller.js";

const router = Router();

router.get("/countries", LocationController.getAllCountries);
router.get("/states/:country_id", LocationController.getAllStates);
router.get("/cities/:state_id", LocationController.getAllCities);

export default router;
