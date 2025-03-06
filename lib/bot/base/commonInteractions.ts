import { CustomContext } from "../../../types/bot";
import { Scenes, Telegraf } from "telegraf";
import { clearSession } from "../utils";

const commonInteractions = (instance: Telegraf<CustomContext> | Scenes.BaseScene<CustomContext>) => {
  // Start/restart bot
  instance.start(async (ctx: CustomContext) => {
    const { update } = ctx;
    if ('message' in update && update.message.from) {
      clearSession(ctx);
      const { id, first_name } = update.message.from;
      ctx.session = {
        ...ctx.session,
        user: {
          id,
          first_name,
        },
      };
    }
    const defaultLocale = ctx.keys?.default_language || 'uk';

    try {
      await ctx.locale(defaultLocale);
      ctx.session.__language_code = defaultLocale;
    } catch (error) {
      console.error('Error on starting scene', error);
    }

    return ctx.scene.enter('welcome');
  });
  // Change locale to EN
  instance.command('en', async (ctx) => {
    try {
      await ctx.locale('en');
      ctx.session.__language_code = 'en';
    } catch (error) {
      console.error('Error on changing locale to EN', error);
    }

    return ctx.scene.enter('welcome');
  });
  // Change locale to UK
  instance.command('uk', async (ctx) => {
    try {
      await ctx.locale('uk');
      ctx.session.__language_code = 'uk';
    } catch (error) {
      console.error('Error on changing locale to UK', error);
    }

    return ctx.scene.enter('welcome');
  });
};

export default commonInteractions;
