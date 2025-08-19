// This file was replaced to delegate to the util implementation in `src/utils/newsFetcher.js`.
// Keeping this re-export so any existing imports continue to work while the original
// implementation has been moved to the util.

import dotenv from "dotenv";
import { fetchNews } from "./utils/newsFetcher.js";
import { publishNews } from "./services/newsPublisher.js";

dotenv.config();

const RSS_URL = process.env.RSS_URL;

(async () => {
  try {
    const news = await publishNews();
    console.log(news);
  } catch (err) {
    console.error("Error fetching news:", err.message);
  }
})();