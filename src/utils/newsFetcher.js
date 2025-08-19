import fetch from "node-fetch";
import { parseStringPromise } from "xml2js";

export async function fetchNews(url) {
  if (!url) throw new Error("RSS URL is required");

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    const xml = await res.text();

    const data = await parseStringPromise(xml, { explicitArray: false });
    const channelTitle = data.rss.channel.title;
    const items = data.rss.channel.item || [];

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
    throw new Error(`Error fetching/parsing RSS: ${err.message}`);
  }
}
