import { fetchNews } from "../utils/newsFetcher.js";
import { db } from "../utils/firebase.js";
import { NewsSchema, FirebaseNewsSchema } from "../models/schemas.js";
import dotenv from "dotenv";
import { fetchExistingNews } from "../utils/firebaseNewsUtils.js";
import { modifyNewsTitles } from './geminiService.js';

dotenv.config();

const RSS_URL = process.env.RSS_URL;

export const publishNews = async () => {
  try {
    // Fetch news from RSS
    const news = await fetchNews(RSS_URL);

    // Validate fetched news structure
    const parsedNews = NewsSchema.parse(news);

    // Fetch last 30 news from Firebase
    const existingNews = await fetchExistingNews();

    // Filter new articles
    const newArticles = parsedNews.articles.filter((article) => {
      return !existingNews.some((existing) => existing.title === article.title);
    });

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
    console.log("New articles published successfully.");
  } catch (error) {
    console.error("Error publishing news:", error.message);
    throw error;
  }
};
