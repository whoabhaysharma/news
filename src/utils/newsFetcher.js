import fetch from "node-fetch";
import { parseStringPromise } from "xml2js";
import logger from "./logger.js";

export async function fetchNews(url) {
  if (!url) {
    logger.error("RSS URL is required for fetching news.");
    throw new Error("RSS URL is required");
  }

  try {
    logger.info({ url }, "Fetching news from URL.");
    const res = await fetch(url);
    if (!res.ok) {
      logger.error({ status: res.status, url }, "HTTP Error when fetching news.");
      throw new Error(`HTTP Error: ${res.status}`);
    }
    const xml = await res.text();
    logger.info({ url }, "Successfully fetched XML content.");

    const data = await parseStringPromise(xml, { explicitArray: false });
    const channelTitle = data.rss.channel.title;
    const items = data.rss.channel.item || [];
    logger.info({ channel: channelTitle, count: items.length }, "Successfully parsed RSS feed.");

    return {
      channelTitle,
      articles: items.map((item) => ({
        title: item.title,
        link: item.link,
        guid: item.guid,
        pubDate: item.pubDate,
        description: item.description
          .replace(/<[^>]*>/g, "")
          .replace(/https?:\/\/\S+/g, "")
          .replace(/&nbsp;/g, " "),
        source: item.source,
      })),
    };
  } catch (err) {
    logger.error({ err, url }, "Error fetching or parsing RSS feed.");
    throw new Error(`Error fetching/parsing RSS: ${err.message}`);
  }
}