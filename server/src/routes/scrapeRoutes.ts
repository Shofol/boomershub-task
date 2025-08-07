import { Router } from "express";
import { ScraperController } from "../controllers/scraperController";

const router = Router();

router.get("/", ScraperController.scrapeProperties);

export default router;
