# Next JS project for Telegram bot and Telegram Mini Apps

## Stack
- Next JS  
- Telegraf
- Ts-node
- Tailwind + Shadcn
- Firebase

## Getting started
1) Create Firebase project
2) Create Firestore and Realtime databases
3) Enable Firebase Auth
4) Create Application. Firebase -> Project settings -> Your apps -> Add app -> Web app
5) Create 'config' collection with 'settings' document in Firestore. Document must have fields `admins` (with an array of strings for admin emails) and `default_language` (with a string for language, 'uk' or 'en' etc.)

## Setting variables
Place `.env`, `.env.local` and `.env.development` files at root folder.

Variables to put there:
```
BOT_TOKEN="..."
TMA_URL="http://localhost:3000"
API_URL="http://localhost:3000"
NEXT_PUBLIC_EMULATOR_FIRESTORE_PATH="127.0.0.1:8080"
NEXT_PUBLIC_EMULATOR_AUTH_PATH="localhost:9099"
NEXT_PUBLIC_EMULATOR_DATABASE_PATH="127.0.0.1:9000"
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyD59z0IjuXALB0KLocAVJYQC4zy9kx-lOI"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="telegram-bot-boilerplate.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_DATABASE_URL="https://telegram-bot-boilerplate-default-rtdb.europe-west1.firebasedatabase.app"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="telegram-bot-boilerplate"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="telegram-bot-boilerplate.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="969927019232"
NEXT_PUBLIC_FIREBASE_APP_ID="1:969927019232:web:bfeda2f6c9c768e8adde85"
```

## Running

### Bot
In local development mode:
`pnpm bot`

On staging or production you must set webhook to
`https://<YOUR_DEPLOYMENT_URL>/api/bot`

### Mini App
In local development mode:
`pnpm dev`