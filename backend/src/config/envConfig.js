import dotenv from 'dotenv';
dotenv.config();

const requiredEnv = [
    'GEMINI_API_KEY',
    'GOOGLE_CLIENT_EMAIL',
    'GOOGLE_PRIVATE_KEY',
    'VERIFY_TOKEN',
    'SPREADSHEET_ID',
    'WHATSAPP_TOKEN'
];
requiredEnv.forEach((key) => {
    if (!process.env[key]) {
        throw new Error(`MISSING KEY: ${key}`)
    }
})
