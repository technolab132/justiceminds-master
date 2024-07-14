import { google } from 'googleapis';

const GMAIL_API_SCOPE = 'https://www.googleapis.com/auth/gmail.readonly';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3000/auth/callback';//'https://sbyocimrxpmvuelrqzuw.supabase.co/auth/v1/callback'//

const gmail = google.gmail({
  version: 'v1',
  auth: new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  ),
});

export async function fetchEmails() {
  try {
    const res = await gmail.users.messages.list({
      userId: 'me',
      q: 'in:inbox',
    });

    return res.data.messages;
  } catch (error) {
    console.error('Error fetching emails:', error);
    throw error;
  }
}
