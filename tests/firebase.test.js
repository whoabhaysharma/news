import { db } from "../src/utils/firebase.js";

describe("Firebase Util", () => {
  it("should initialize Firestore", () => {
    expect(db).toBeDefined();
  });

  it("should fetch collections without error", async () => {
    const snapshot = await db.collection("news").get();
    expect(snapshot).toBeDefined();
    expect(snapshot.empty).toBe(false);
  });
});
