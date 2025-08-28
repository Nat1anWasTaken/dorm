/**
 * Server-side Firebase configuration for API routes
 */

import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Debug: Log configuration status (remove in production)
if (process.env.NODE_ENV === "development") {
  console.log("Firebase server config:", {
    apiKey: firebaseConfig.apiKey ? "✅ Set" : "❌ Missing",
    authDomain: firebaseConfig.authDomain ? "✅ Set" : "❌ Missing",
    projectId: firebaseConfig.projectId ? "✅ Set" : "❌ Missing",
    appId: firebaseConfig.appId ? "✅ Set" : "❌ Missing",
  });
}

function createFirebaseApp(): FirebaseApp | null {
  try {
    // Check if any Firebase apps are already initialized
    const existingApps = getApps();
    if (existingApps.length > 0) {
      return existingApps[0];
    }

    // Validate required environment variables
    if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
      console.warn(
        "⚠️ Firebase configuration missing. Some environment variables are not set."
      );
      return null;
    }

    return initializeApp(firebaseConfig, "server");
  } catch (error) {
    console.error("❌ Failed to initialize Firebase:", error);
    return null;
  }
}

const app = createFirebaseApp();
export const db: Firestore | null = app ? getFirestore(app) : null;

// Export the app as well for potential use
export { app };
