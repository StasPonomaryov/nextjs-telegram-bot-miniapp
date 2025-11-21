import * as admin from "firebase-admin";
import { cert, getApps, ServiceAccount } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getDatabase, Database } from "firebase-admin/database";
import { getAuth, Auth } from "firebase-admin/auth";
import dotenv from "dotenv";

dotenv.config();

const serviceAccount = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: process.env.NEXT_FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.NEXT_FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
} as ServiceAccount;

function validateServerEnv() {
  const required = ["NEXT_PUBLIC_FIREBASE_DATABASE_URL"];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) {
    console.error(
      `[Firebase Admin Init Error] Missing environment variables: ${missing.join(", ")}`
    );
    throw new Error("Firebase admin initialization failed due to missing environment variables.");
  }
}

validateServerEnv();

let firestore: Firestore;
let database: Database;
let auth: Auth;

try {
  const currentApps = getApps();

  if (currentApps.length === 0) {
    if (
      process.env.NEXT_PUBLIC_EMULATOR_FIRESTORE_PATH?.length &&
      process.env.NEXT_PUBLIC_EMULATOR_DATABASE_PATH?.length &&
      process.env.NEXT_PUBLIC_EMULATOR_AUTH_PATH?.length
    ) {
      process.env["FIRESTORE_EMULATOR_HOST"] = process.env.NEXT_PUBLIC_EMULATOR_FIRESTORE_PATH;
      process.env["DATABASE_EMULATOR_HOST"] = process.env.NEXT_PUBLIC_EMULATOR_DATABASE_PATH;
      process.env["FIREBASE_AUTH_EMULATOR_HOST"] = process.env.NEXT_PUBLIC_EMULATOR_AUTH_PATH;
      console.log("[Firebase Admin] Using local emulators");
    }

    const app = admin.initializeApp({
      credential: cert(serviceAccount as ServiceAccount),
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    });

    firestore = getFirestore(app);
    database = getDatabase(app);
    auth = getAuth(app);
  } else {
    const app = currentApps[0];
    firestore = getFirestore(app);
    database = getDatabase(app);
    auth = getAuth(app);
  }
} catch (err) {
  console.error("[Firebase Admin Init Error] Failed to initialize Firebase Admin SDK:", err);
  throw err;
}

export { firestore, database, auth };