import * as admin from 'firebase-admin'
import serviceAccount from './service-account.json';
import { cert, getApps, ServiceAccount } from "firebase-admin/app";
import { Firestore, getFirestore } from 'firebase-admin/firestore';
import { getDatabase, Database } from "firebase-admin/database";
import { Auth, getAuth } from 'firebase-admin/auth';
import dotenv from 'dotenv'; 
dotenv.config();

const currentApps = getApps();

let firestore: Firestore
let database: Database;
let auth: Auth;

if (currentApps.length <= 0) {
  if (process.env.NEXT_PUBLIC_EMULATOR_FIRESTORE_PATH?.length
    && process.env.NEXT_PUBLIC_EMULATOR_DATABASE_PATH?.length
    && process.env.NEXT_PUBLIC_EMULATOR_AUTH_PATH?.length
  ) {
    process.env['FIRESTORE_EMULATOR_HOST'] = process.env.NEXT_PUBLIC_EMULATOR_FIRESTORE_PATH;
    process.env['DATABASE_EMULATOR_HOST'] = process.env.NEXT_PUBLIC_EMULATOR_DATABASE_PATH;
    process.env['FIREBASE_AUTH_EMULATOR_HOST'] = process.env.NEXT_PUBLIC_EMULATOR_AUTH_PATH;
  }
  const app = admin.initializeApp({
    credential: cert(serviceAccount as ServiceAccount),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  });
  database = getDatabase(app);
  firestore = getFirestore(app);
  auth = getAuth(app);
} else {
  const app = currentApps[0];
  database = getDatabase(app);
  firestore = getFirestore(app);
  auth = getAuth(app);
}

export { database, firestore, auth };