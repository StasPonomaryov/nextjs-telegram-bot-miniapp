import * as admin from 'firebase-admin'
import serviceAccount from './service-account.json';
import { cert, getApps, ServiceAccount } from "firebase-admin/app";
import { Firestore, getFirestore } from 'firebase-admin/firestore';
import { getDatabase, Database } from "firebase-admin/database";
import { Auth, getAuth } from 'firebase-admin/auth';

const currentApps = getApps();

let firestore: Firestore
let db: Database;
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
    databaseURL: 'https://telegram-bot-boilerplate-default-rtdb.europe-west1.firebasedatabase.app',
  });
  db = getDatabase(app);
  firestore = getFirestore(app);
  auth = getAuth(app);
} else {
  const app = currentApps[0];
  db = getDatabase(app);
  firestore = getFirestore(app);
  auth = getAuth(app);
}

export { db, firestore, auth };