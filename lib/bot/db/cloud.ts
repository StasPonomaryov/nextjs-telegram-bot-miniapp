import { BotSettings } from "@/types/bot";

class CloudDb {
  private db: FirebaseFirestore.Firestore;

  private configCollection: string;

  private settingsDocument: string;

  constructor(db: FirebaseFirestore.Firestore) {
    this.db = db;
    this.configCollection = 'config';
    this.settingsDocument = 'settings';
  }

  async getSettings() {
    const settingsCollection = this.db.collection(this.configCollection).doc(this.settingsDocument);
    const settingsSnapshot = await settingsCollection.get();

    if (!settingsSnapshot.exists) {
      return null;
    }
    
    const settings = settingsSnapshot.data() as BotSettings;

    return settings;
  }
}

export default CloudDb;
