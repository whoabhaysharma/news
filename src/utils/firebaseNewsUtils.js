import { db } from "./firebase.js";

export const fetchExistingNews = async () => {
  const snapshot = await db.collection("news").orderBy("created", "desc").limit(30).get();
  return snapshot.docs.map((doc) => doc.data());
};
