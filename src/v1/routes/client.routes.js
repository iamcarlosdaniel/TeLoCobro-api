import { Router } from "express";

const router = Router();

router.post("/load");

router.post("/:id");

export default router;
