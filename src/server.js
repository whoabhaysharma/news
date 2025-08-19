import express from "express";
import { publishNews } from "./services/newsPublisher.js";
import logger from "./utils/logger.js";
import cron from "node-cron";
import dotenv from "dotenv";

dotenv.config();

const CRON_INTERVAL = process.env.CRON_INTERVAL;

if (!CRON_INTERVAL) {
  logger.error("CRON_INTERVAL is not defined in the environment variables.");
  process.exit(1);
}

logger.info(`Starting cron job with interval: ${CRON_INTERVAL}`);

cron.schedule(CRON_INTERVAL, async () => {
  try {
    logger.info("Running scheduled task: publishNews");
    await publishNews();
  } catch (error) {
    logger.error({ err: error }, "Error occurred during scheduled task execution.");
  }
});

const app = express();
const PORT = 3000;

app.get("/publish", async (req, res) => {
  try {
    logger.info("Received request to publish news.");
    await publishNews();
    res.status(200).send("News published successfully.");
  } catch (error) {
    logger.error({ err: error }, "Error publishing news.");
    res.status(500).send("Failed to publish news.");
  }
});

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
