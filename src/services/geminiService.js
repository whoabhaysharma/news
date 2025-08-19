import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Modifies the titles of a list of news articles using the Gemini API.
 *
 * @param {Array<Object>} articles - An array of article objects, each with a 'title' property.
 * @returns {Promise<Array<Object>>} A promise that resolves to the array of articles with modified titles.
 */
export async function modifyNewsTitles(articles) {
  if (!articles || articles.length === 0) {
    return articles;
  }

  const originalTitles = articles.map((article) => article.title);

  const contents = process.env.GEMINI_INSTRUCTION.replace(process.env.GEMINI_MACRO, JSON.stringify(originalTitles));

  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL,
    contents,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.STRING,
        },
      },
    },
  });

  try {
    const modifiedTitles = JSON.parse(response.text);

    if (modifiedTitles.length !== articles.length) {
      throw new Error("The number of modified titles does not match the number of original articles.");
    }

    const modifiedArticles = articles.map((article, index) => ({
      ...article,
      title: modifiedTitles[index] || article.title,
    }));

    return modifiedArticles;
  } catch (error) {
    console.error("Error modifying news titles with Gemini:", error);
    return articles;
  }
}