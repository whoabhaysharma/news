import express from "express";
import { publishNews } from "./services/newsPublisher.js";
import logger from "./utils/logger.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;

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

logger.info("Initializing server...");

app.on("close", () => {
  logger.warn("Server is closing...");
});

app.on("error", (error) => {
  logger.error({ err: error }, "Server encountered an error.");
});

process.on("uncaughtException", (error) => {
  logger.error({ err: error }, "Unhandled exception occurred.");
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.error({ err: reason }, "Unhandled promise rejection occurred.");
  process.exit(1);
});
