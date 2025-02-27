/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Middleware } from 'telegraf';
import { CustomContext } from '../../../types/bot';

type TSomeFunc = () => PromiseLike<unknown>;

function nextWrapper(name: string, fn: Function) {
  return function (this: Function, ...args: unknown[]) {
    console.log(`End middleware ${name}`);
    return fn.apply(this, args);
  };
}

export default function wrapper(name: string, fn: Function) {
  return function (this: Middleware<CustomContext>, ctx: { session: unknown }, next: TSomeFunc) {
    console.log(`Start middleware ${name}`, ctx.session);
    return fn.apply(this, [ctx, nextWrapper(name, next)]);
  };
}