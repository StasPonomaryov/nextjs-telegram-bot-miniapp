import * as functions from 'firebase-functions/v1';
import * as admin from "firebase-admin";
import { logger } from 'firebase-functions/v1';
import { getAuth } from 'firebase-admin/auth';
import { debug } from 'firebase-functions/logger';

admin.initializeApp();

const db = admin.firestore();

export const saveUserEmailOnCreation = functions
  .auth.user()
  .onCreate(async (event) => {
    try {
      debug('>>>EVENT', event);
      const { uid, email } = event;

      if (!email) {
        logger.warn(`User ${uid} created without an email. Skipping Firestore save.`);
        return;
      }

      if (email === 'ponomaryov.stas@gmail.com') {
        const customClaim = { role: 'admin' };

        try {
          await getAuth().setCustomUserClaims(uid, customClaim);
        } catch (error) {
          logger.error(`Failed to set custom claim for user ${uid}:`, error);
          throw error;
        }
      }

      await db.collection("users").doc(uid).set(
        {
          email: email,
          createdAt: new Date(), 
        },
        { merge: true } 
      );

      logger.info(`Successfully saved email for user ${uid} to Firestore.`);

    } catch (error) {
      logger.error(`Failed to save email for user:`, error);
      throw error;
    }
  }
);
