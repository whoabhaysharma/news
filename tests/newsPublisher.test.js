import { publishNews } from "../src/services/newsPublisher.js";
import dotenv from "dotenv";
import logger from "../src/utils/logger.js";

dotenv.config();

describe("publishNews", () => {
  it("should publish new articles to Firebase", async () => {
    try {
      await publishNews();
      logger.info("publishNews executed successfully in test.");
    } catch (error) {
      logger.error({ err: error }, "Error during publishNews test.");
      throw error;
    }
  });
});