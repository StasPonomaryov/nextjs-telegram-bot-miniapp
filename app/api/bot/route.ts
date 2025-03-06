import { NextResponse } from "next/server";
import localSettings from "@/config/config.json";
import Bot from "@/lib/bot/bot";
import CloudDb from "@/lib/bot/db/cloud";
import { firestore } from "@/lib/firebase-server";
import { BotSettings } from "@/types/bot";

const keys = {
  bot: {
    token: process.env.TELEGRAM_BOT_TOKEN!,
  },
};

const config = {
  keys: {
    ...localSettings.settings,
    ...keys,
  },
};

const bot = Bot(config);
let isBotRunning = false; 

export async function GET() {
  if (!isBotRunning && config.keys.bot?.token) {
    await bot.launch();
    isBotRunning = true;
    console.log("Bot started on long polling");
    return NextResponse.json({ status: "Bot is running" });
  }

  console.log("Bot is already started.");

  return NextResponse.json({ status: "Bot is already running" });
}

export async function POST(request: Request) {
  try {
    const source = new CloudDb(firestore);
    const [settings, body] = await Promise.all([
      source.getSettings(),
      request.json(),
    ]);

    config.keys = {
      ...(settings || (localSettings.settings as BotSettings)),
      ...keys,
    };

    console.log("Updated settings:", config);
    await bot.handleUpdate(body);

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Bot error:", error);
    return NextResponse.json({ error: "Bot error" }, { status: 500 });
  }
}
