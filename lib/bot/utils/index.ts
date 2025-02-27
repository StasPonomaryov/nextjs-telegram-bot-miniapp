import { get } from 'lodash';
import * as enFile from '../locale/en/translation.json';
import * as ukFile from '../locale/uk/translation.json';
import { CustomContext } from '@/types/bot';

const resources = {
  en: {
    translation: enFile,
  },
  uk: {
    translation: ukFile,
  },
};
/**
 * Check if bot in production mode
 * @returns {Boolean}
 */
export const isProd = (): boolean => (
  process.env.GCLOUD_PROJECT !== undefined
  && !process.env.GCLOUD_PROJECT.includes('dev')
  && !process.env.GCLOUD_PROJECT.includes('not-a-project')
);
/**
 * Check if bot in test mode
 * @returns {Boolean}
 */
export const isTest = (): boolean => process.env.GCLOUD_PROJECT !== undefined
  && process.env.GCLOUD_PROJECT.includes('not-a-project');
/**
 * Check if bot in local use
 * @returns {Boolean}
 */
export const isLocal = (): boolean => process.env.APPDATA !== undefined;
/**
 * Check if bot in test mode in local use
 * @returns {Boolean}
 */
export const isTestLocal = (): boolean => process.env.GCLOUD_PROJECT === undefined;
/**
 * Escape special symbols for Telegram message with markdown
 * @param stringToEscape
 * @returns
 */
export const escapeSymbolsMd = (stringToEscape: string): string => stringToEscape
  .replace(/_/gi, '\\_')
  .replace(/~/gi, '\\~')
  .replace(/!/gi, '\\!')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/\*/g, '\\*')
  .replace(/`/g, '\\`')
  .replace(/\n/g, '\\\n');

export const escapeSymbolsRtDb = (stringToEscape: string) => stringToEscape
  .replace(/#/g, '&num;')
  .replace(/$/g, '&dollar;')
  .replace(/\//g, '&sol;')
  .replace(/\[/g, '&lsqb;')
  .replace(/\]/g, '&rsqb;')
  .replace(/./g, '_');

export const match = (
  key: string,
) => Object.values(resources).map((v) => get(v.translation, key));

export const clearSession = (ctx: CustomContext) => {
  const emptySession = {
    __language_code: undefined,
    user: undefined,
  };
  ctx.session = emptySession;
};

export const mapBackNavigation = (currentScene: string) => {
  console.log('>>>CURRENT SCENE', currentScene, __dirname);
  return {
    feedback: 'main',
    support: 'main',
  }[currentScene] || 'main';
};