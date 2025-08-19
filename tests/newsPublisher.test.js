import { publishNews } from "../src/services/newsPublisher.js";
import dotenv from "dotenv";

dotenv.config();

describe("publishNews", () => {
  it("should publish new articles to Firebase", async () => {
    try {
      await publishNews();
      console.log("publishNews executed successfully.");
    } catch (error) {
      console.error("Error during publishNews test:", error.message);
      throw error;
    }
  });
});
