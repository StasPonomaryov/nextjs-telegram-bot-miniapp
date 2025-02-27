import { Middleware, session } from 'telegraf';
import { database } from '../firebase-server';
import firebaseSession from './middleware/telegraf-session-firebase-local';
import create from './factory';
import { isLocal } from './utils';
import { Keys, CustomContext } from '../../types/bot';

// get session depend on local/dev
const getSession = () => {
  if (isLocal()) {
    return session();
  }

  return firebaseSession(database.ref('sessions'));
};
/**
 * Main bot function
 * @param config - bot settings
 * @param database - bot's data store
 */
const Bot = (config: Keys) => {
  console.log('>>>CONFIG IN BOT', config);
  return create(
    getSession() as Middleware<CustomContext>,
    config,
  );
};

export default Bot;
