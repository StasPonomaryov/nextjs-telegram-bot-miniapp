import type { Context, Scenes } from 'telegraf';
import type { TFunction, Callback } from 'i18next';

export interface BotMainConfig {
    bot: {
      token: string;
    };
    sentry?: {
      dsn: string;
      environment: string;
    };
    ga?: {
      tid: string;
    };
  }
  
  export interface BotSettings {
    default_language: string;
    admins: string[]
  }
  
  export interface MySession extends Scenes.SceneSession {
    __language_code?: string;
    user?: {
      id?: number | string;
      first_name?: string;
      phone?: string;
    };
  }

export interface Keys {
  keys: BotSettings & BotMainConfig;
}

export interface CustomContext extends Context {
  session: MySession;
  keys: BotSettings & BotMainConfig;
  t: TFunction<string[], string[]>;
  locale: (lng?: string | undefined, callback?: Callback | undefined) => Promise<TFunction<'translation', 'translation'>>;
  scene: Scenes.SceneContextScene<CustomContext>;
}