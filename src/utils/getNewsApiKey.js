// src/utils/getNewsApiKey.js

/**
 * Safely get a NewsData.io API key.
 *
 * Priority:
 *  1. Environment variable (process.env.NEWS_API_KEY)
 *  2. Firebase Remote Config / Firestore (if initialized)
 *  3. Hardcoded fallback (so local dev still runs)
 */

let cachedKey = null;

export async function getNewsApiKey() {
  if (cachedKey) return cachedKey;

  // 1) Environment variables
  if (typeof process !== "undefined" && process.env?.NEWS_API_KEY) {
    cachedKey = process.env.NEWS_API_KEY;
    return cachedKey;
  }

  // 2) Firebase Remote Config / Firestore (optional)
  try {
    if (typeof window !== "undefined" && window.firebase) {
      const remoteConfig = window.firebase.remoteConfig?.();
      if (remoteConfig) {
        await remoteConfig.fetchAndActivate();
        const key = remoteConfig.getString("NEWS_API_KEY");
        if (key) {
          cachedKey = key;
          return cachedKey;
        }
      }

      // Or Firestore fallback
      const db = window.firebase.firestore?.();
      if (db) {
        const docRef = db.collection("config").doc("newsApi");
        const doc = await docRef.get();
        if (doc.exists && doc.data()?.key) {
          cachedKey = doc.data().key;
          return cachedKey;
        }
      }
    }
  } catch (err) {
    console.warn("[getNewsApiKey] Firebase lookup skipped:", err?.message || err);
  }

  // 3) Hardcoded fallback (replace with your pub key)
  cachedKey = "pub_9d7f5978df4245038eee1ca5acbe7471";
  return cachedKey;
}

export default getNewsApiKey;
