import { Router } from "express";
import { ScraperController } from "../controllers/scraperController";

const router = Router();

router.get("/scrape", ScraperController.getProvider);
router.get("/test-csv", ScraperController.testCSVReading);

export default router;
