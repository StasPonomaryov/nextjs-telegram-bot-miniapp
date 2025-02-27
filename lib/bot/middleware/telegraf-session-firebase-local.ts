import { Reference } from 'firebase-admin/database';
import type { Middleware } from 'telegraf';
import { CustomContext } from '../../../types/bot';

const firebaseLocalSession = (sessionRef: Reference) => {
  const options = {
    property: 'session',
    getSessionKey: (ctx: CustomContext) => ctx.from && ctx.chat && `${ctx.from.id}/${ctx.chat.id}`,
  };

  function getSession(key: string) {
    return sessionRef.child(key).once('value')
      .then((snapshot) => snapshot.val());
  }

  function saveSession(key: string, session: object) {
    if (!session || Object.keys(session).length === 0) {
      return sessionRef.child(key).remove();
    }
    console.log('Saving session', key, session);
    return sessionRef.child(key).set(session);
  }

  return async (ctx: CustomContext, next: () => Middleware<CustomContext>) => {
    const key = options.getSessionKey(ctx);
    if (!key) {
      return next();
    }
    const value = await getSession(key);
    let session = value || {};
    Object.defineProperty(ctx, options.property, {
      get() {
        return session;
      },
      set(newValue) {
        session = { ...newValue };
      },
    });

    await next();
    return saveSession(key, session);
  };
};

export default firebaseLocalSession;
