import { Router } from "express";
import { ScraperController } from "../controllers/scraperController";

const router = Router();

router.get("/scrape", ScraperController.getProvider);

export default router;
