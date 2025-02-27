import { Markup } from "telegraf";
import { CustomContext } from "@/types/bot";
import BotError from "../../utils/botError";

const SceneEnter = async (ctx: CustomContext) => {
  const { user } = ctx.session;

  if (!user) {
    throw new BotError('No ser session', 'noSession');
  }

  const { id: userId } = user;
  const tmaUrl = process.env.NEXT_PUBLIC_TMA_URL;

  return ctx.reply(ctx.t('welcome.hello'), Markup.keyboard([
    [
      Markup.button.webApp(ctx.t('buttons.webapp'), `${tmaUrl}/?source=${userId}`),
    ],
  ]).resize());
};

export default SceneEnter;
