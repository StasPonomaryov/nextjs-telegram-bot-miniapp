import * as Sentry from '@sentry/node';
import {
  Markup,
  Middleware, MiddlewareFn, Telegraf,
} from 'telegraf';
import * as i18n from 'i18next';
// import { Message, Update } from 'telegraf/typings/core/types/typegram';
import wrapper from './middleware/middleware-wrapper';
import stage from './base/sceneManager';
import commonInteractions from './base/commonInteractions';
import * as utils from './utils';
import { CustomContext, Keys } from '../../types/bot';
import * as enFile from './locale/en/translation.json';
import * as ukFile from './locale/uk/translation.json';


const resources = {
  en: {
    translation: enFile,
  },
  uk: {
    translation: ukFile,
  },
};
/**
  * Send error to Sentry
  */
const sendToSentry = (ctx: CustomContext, error: Error) => new Promise<void>((resolve) => {
  Sentry.withScope((scope) => {
    scope.setExtra('update', ctx.update);
    scope.setExtra('session', ctx.session);
    scope.setUser({
      ...ctx.from,
      id: `${ctx.from?.id}`,
    });
    Sentry.captureException(error);
    resolve();
  });
});
/**
 * Last middleware if want to get unhandleded updates
 */
const defaultHandler = async (ctx: CustomContext) => {
  console.info('Entering last middleware');

  if ('message' in ctx.update
    && ctx.update.message?.chat?.id > 0) {
    console.log('>>>TEXT FROM', ctx.update.message.chat.id);
    await ctx.reply(ctx.t('message.not_found'));
  }

  console.info('Exiting last middleware');
};

/**
 * Factory to create bot instance
 */
const create = (session: Middleware<CustomContext>, config: Keys) => {
  const { keys } = config;
  console.log('Started creating instance', keys);
  i18n
    .init({
      lng: keys.default_language,
      debug: false,
      fallbackLng: keys.default_language || 'uk',
      resources,
      interpolation: {
        escapeValue: false,
      },
    });
  // declare a bot
  const bot = new Telegraf<CustomContext>(keys.bot!.token);
  // use session
  bot.use(wrapper('session', session as MiddlewareFn<CustomContext>));
  // put necessary data to bot context
  bot.context.keys = keys;
  bot.context.t = i18n.t;
  bot.context.locale = i18n.changeLanguage;
  // catching errors
  bot.catch(async (error, ctx) => {
    if (!utils.isLocal()) {
      await sendToSentry(ctx, error as Error);
    }
    console.error('+++ERROR+++', error);
    if (typeof ctx.callbackQuery !== 'undefined') await ctx.answerCbQuery();

    await ctx.reply(
      ctx.t('errors.general_error'),
      Markup.keyboard([
        [
          Markup.button.text(ctx.t('buttons.leave_a_review')),
          Markup.button.text(ctx.t('buttons.back')),
        ],
      ]).resize(),
    );
  });
  // use stage middleware (scenes)
  bot.use(wrapper('stage', stage.middleware()));
  // latency checking middleware
  bot.use(async (ctx, next) => {
    const start = new Date().getTime();

    return next().then((result) => {
      const ms = new Date().getTime() - start;
      const scene = ctx && ctx.session && ctx.session.__scenes
        ? ctx.session.__scenes.current
        : null;
      console.info(
        `Response time: ${ms}ms. Current scene: ${scene}`,
        ctx.message,
      );

      return result;
    });
  });
  // TMA sent data
  bot.on('web_app_data', async (ctx) => {
    const { data } = ctx.message.web_app_data;
    const message = ctx.t('webapp.received_data', { data });

    return ctx.reply(message);
  });
  commonInteractions(bot);
  // use default handler
  bot.use(defaultHandler);
  console.info('Ended creating instance');

  return bot;
};

export default create;