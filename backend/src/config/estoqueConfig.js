import { google } from 'googleapis'


export const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.split(String.raw`\n`).join('\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
});

console.log("SPREADSHEET_ID =", process.env.SPREADSHEET_ID);

export const sheets = google.sheets({
    version: 'v4',
    auth,
});
