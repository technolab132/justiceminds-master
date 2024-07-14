import { google } from 'googleapis';

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXT_PUBLIC_REDIRECT_URL}/auth/callback`
);

const GMAIL_API_SCOPE = 'https://www.googleapis.com/auth/gmail.readonly';

export default function handler(req, res) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [GMAIL_API_SCOPE],
  });

  res.status(200).json({ authUrl });
}
// import { google } from 'googleapis';
// import { supabase } from '../../../utils/supabaseClient';

// export default async function handler(req, res) {
//   const { user } = await supabase.auth.getUser();
//   console.log('user',user);
//   if (!user) {
//     return res.status(401).json({ error: 'Unauthorized' });
//   }

//   const { access_token } = user.session.access_token;
//   const oAuth2Client = new google.auth.OAuth2();
//   oAuth2Client.setCredentials({ access_token });

//   const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

//   try {
//     const response = await gmail.users.messages.list({
//       userId: 'me',
//       maxResults: 10,
//     });

//     res.status(200).json(response.data);
//   } catch (error) {
//     console.error('Error fetching emails:', error);
//     res.status(500).json({ error: error.message });
//   }
// }
