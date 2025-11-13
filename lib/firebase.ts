import { initializeApp, getApps } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

function validateFirebaseConfig(config: Record<string, any>) {
  const missingKeys = Object.entries(config)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingKeys.length > 0) {
    console.error(
      `[Firebase Init Error] Missing or invalid environment variables: ${missingKeys.join(", ")}`
    );
    throw new Error("Firebase client initialization failed due to missing environment variables.");
  }
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  // measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};

validateFirebaseConfig(firebaseConfig);

let app;
try {
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
} catch (err) {
  console.error("[Firebase Init Error] Failed to initialize Firebase client app:", err);
  throw err;
}

const firestore = getFirestore(app);
const auth = getAuth(app);

try {
  if (
    process.env.NEXT_PUBLIC_EMULATOR_FIRESTORE_PATH?.length &&
    process.env.NEXT_PUBLIC_EMULATOR_AUTH_PATH?.length
  ) {
    console.log("[Firebase] Connecting to local emulators...");
    connectFirestoreEmulator(firestore, "localhost", 8080);
    connectAuthEmulator(auth, "http://localhost:9099");
  }
} catch (err) {
  console.warn("[Firebase Emulator Warning]", err);
}

export { firestore, auth };