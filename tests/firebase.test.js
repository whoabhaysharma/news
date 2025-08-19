import { db } from "../src/utils/firebase.js";

describe("Firebase Util", () => {
  it("should initialize Firestore", () => {
    expect(db).toBeDefined();
  });

  it("should fetch collections without error", async () => {
    try {
      const snapshot = await db.collection("news").get();
      expect(snapshot).toBeDefined();
    } catch (error) {
      throw new Error("Error fetching Firestore collections: " + error.message);
    }
  });
});
