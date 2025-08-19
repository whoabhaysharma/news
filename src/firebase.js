import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const db = admin.firestore();

// Fetch and log documents from the 'news' collection
(async () => {
  try {
    const newsCollection = await db.collection("news").get();
    newsCollection.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());
    });
  } catch (error) {
    console.error("Error fetching 'news' collection:", error);
  }
})();
