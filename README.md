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
5) Download service account file. Open Firebase -> Project settings -> Service accounts -> Generate new private key. Download file, rename it to service-account.json and replace the empty one in `lib` folder
6) Create 'config' collection with 'settings' document in Firestore. Document must have fields `admins` (with an array of strings for admin emails) and `default_language` (with a string for language, 'uk' or 'en' etc.)

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
NEXT_PUBLIC_FIREBASE_API_KEY="..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
NEXT_PUBLIC_FIREBASE_DATABASE_URL="..."
NEXT_PUBLIC_FIREBASE_PROJECT_ID="..."
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="..."
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
NEXT_PUBLIC_FIREBASE_APP_ID="..."
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