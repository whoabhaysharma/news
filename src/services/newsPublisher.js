import { fetchNews } from "../utils/newsFetcher.js";
import { db } from "../utils/firebase.js";
import { NewsSchema, FirebaseNewsSchema } from "../models/schemas.js";
import dotenv from "dotenv";
import { fetchExistingNews } from "../utils/firebaseNewsUtils.js";
import { modifyNewsTitles } from './geminiService.js';
import logger from '../utils/logger.js';

dotenv.config();

const RSS_URL = process.env.RSS_URL;

export const publishNews = async () => {
  try {
    logger.info("Starting news publishing process.");

    // Fetch news from RSS
    const news = await fetchNews(RSS_URL);
    logger.info(`Fetched ${news.articles.length} articles from RSS feed.`);

    // Validate fetched news structure
    const parsedNews = NewsSchema.parse(news);

    // Fetch last 30 news from Firebase
    const existingNews = await fetchExistingNews();
    logger.info(`Found ${existingNews.length} existing articles in the database.`);

    // Filter new articles
    const newArticles = parsedNews.articles.filter((article) => {
      return !existingNews.some((existing) => existing.originalTitle === article.title);
    });

    logger.info(`Found ${newArticles.length} new articles to publish.`);

    if (newArticles.length === 0) {
      logger.info("No new articles to publish. Exiting.");
      return;
    }

    const articlesWithModifiedTitles = await modifyNewsTitles(newArticles);

    // Push new articles to Firebase
    const batch = db.batch();
    articlesWithModifiedTitles.forEach((article) => {
      const docRef = db.collection("news").doc();
      const firebaseArticle = FirebaseNewsSchema.parse({
        id: docRef.id,
        data: {
          ...article,
          created: new Date().toISOString(),
        },
      });
      batch.set(docRef, firebaseArticle.data);
    });

    await batch.commit();
    logger.info(`Successfully published ${articlesWithModifiedTitles.length} new articles.`);

    // Log published articles in chunks of 5 with full object details
    for (let i = 0; i < articlesWithModifiedTitles.length; i += 5) {
      const chunk = articlesWithModifiedTitles.slice(i, i + 5);
      logger.info(`Published articles chunk: ${JSON.stringify(chunk, null, 2)}`);
    }
  } catch (error) {
    logger.error({ err: error }, "Error publishing news.");
    throw error;
  }
};