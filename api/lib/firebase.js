// api/lib/firebase.js
import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
  console.log("🔥 Firebase initialized with app:", admin.apps[0].name);
}

export const db = admin.firestore();
export const storage = admin.storage();
export default admin;
