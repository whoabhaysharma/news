import express from "express";
import { publishNews } from "./services/newsPublisher.js";
import logger from "./utils/logger.js";
import cron from "node-cron";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const CRON_INTERVAL = process.env.CRON_INTERVAL;
const PORT = process.env.PORT || 3000;
const SERVER_URL = process.env.SERVER_URL || `http://localhost:${PORT}`;

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

cron.schedule("*/5 * * * *", async () => {
  try {
    logger.info("Hitting empty endpoint for health check.");
    await fetch(`${SERVER_URL}/health`);
  } catch (error) {
    logger.error({ err: error }, "Error hitting health check endpoint.");
  }
});

const app = express();

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

app.get("/health", (req, res) => {
  res.status(200).send("Server is healthy.");
});

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
