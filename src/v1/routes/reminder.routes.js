import { Router } from "express";

import reminderController from "../../controllers/reminder.controller.js";

import { authenticationMiddleware } from "../../middlewares/authentication.middleware.js";
import { authorizationMiddleware } from "../../middlewares/authorization.middleware.js";

const router = Router();

router.post(
  "/enable",
  authenticationMiddleware,
  authorizationMiddleware("user"),
  reminderController.enableReminderConfig
);

router.post(
  "/disable",
  authenticationMiddleware,
  authorizationMiddleware("user"),
  reminderController.disableReminderConfig
);

router.get(
  "/config",
  authenticationMiddleware,
  authorizationMiddleware("user"),
  reminderController.getReminderConfig
);

router.post(
  "/config",
  authenticationMiddleware,
  authorizationMiddleware("user"),
  reminderController.setFrecuencyReminderConfig
);

router.get(
  "/",
  authenticationMiddleware,
  authorizationMiddleware("user"),
  reminderController.getAllCompanyReminders
);

router.get(
  "/:id([0-9a-fA-F]{24})",
  authenticationMiddleware,
  authorizationMiddleware("user"),
  reminderController.getMyClientsReminderById
);

router.get(
  "/client/:id([0-9a-fA-F]{24})",
  authenticationMiddleware,
  authorizationMiddleware("user"),
  reminderController.getAllRemindersByClientId
);

router.post(
  "/send",
  authenticationMiddleware,
  authorizationMiddleware("user"),
  reminderController.sendReminder
);

export default router;
