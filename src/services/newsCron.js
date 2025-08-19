import cron from "node-cron";
import dotenv from "dotenv";
import logger from "../utils/logger.js";
import { publishNews } from "./newsPublisher.js";

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
