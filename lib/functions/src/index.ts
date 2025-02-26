import * as functions from 'firebase-functions/v1';
import * as admin from "firebase-admin";
import { logger } from 'firebase-functions/v1';
import { getAuth } from 'firebase-admin/auth';
import { debug } from 'firebase-functions/logger';
import defaultSettings from '../../../config/config.json';

admin.initializeApp();

const db = admin.firestore();
/**
 * This function is triggered when a new user is created in Firebase Authentication.
 */
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

      let adminsEmails = [];

      try {
        const adminsSnapshot = await db.collection('config').doc('settings').get();

        if (!adminsSnapshot.exists) {
          logger.warn('No admins found in Firestore.');
          return;
        }

        adminsEmails = adminsSnapshot.data()?.admins || [];

        if (!adminsEmails.length) {
          await db.collection('config').doc('settings').set(defaultSettings);
        }
      } catch (error) {
        logger.error('Failed to fetch admins from Firestore:', error);
        throw error;
      }

      if (adminsEmails.includes(email)) {
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
