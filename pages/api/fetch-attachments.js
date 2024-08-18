import { google } from 'googleapis';
import cookie from 'cookie';
const getOAuth2Client = (accessToken, refreshToken) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback` // Ensure this matches your redirect URI
  );

  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  return oauth2Client;
};

const refreshAccessToken = async (oauth2Client) => {
  try {
    const { credentials } = await oauth2Client.refreshToken(oauth2Client.credentials.refresh_token);
    return credentials.access_token;
  } catch (error) {
    console.error('Error refreshing access token:', error.response ? error.response.data : error.message);
    throw new Error('Failed to refresh access token');
  }
};
export default async function handler(req, res) {
  const { emailId, attachmentId } = req.query;

  if (!emailId || !attachmentId) {
    return res.status(400).json({ error: 'Missing emailId or attachmentId' });
  }

  try {
    if(req.query.token){
      const accessToken = req.query.token;
      const refreshToken = req.query.refreshToken;
      if (!accessToken || !refreshToken) {
        console.log('accessToken',accessToken);
        return res.status(401).json({ error: 'No OAuth tokens found' });
      }

      let oauth2Client = getOAuth2Client(accessToken, refreshToken);

      // Check if the access token is expired and refresh if needed
      try {
        await oauth2Client.getTokenInfo(accessToken);
      } catch {
        console.log('Access token expired or invalid, attempting to refresh...');
        try {
          const newAccessToken = await refreshAccessToken(oauth2Client);
          oauth2Client = getOAuth2Client(newAccessToken, refreshToken);
          // Update cookies with the new access token
          res.setHeader('Set-Cookie', [
            cookie.serialize('access_token', newAccessToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              maxAge: 60 * 60 * 24 * 7, // 1 week
              sameSite: 'strict',
              path: '/'
            })
          ]);
        } catch (refreshError) {
          console.error('Failed to refresh access token, redirecting to authentication:', refreshError);
          return res.status(401).json({ error: 'auth_required', message: 'Please authenticate again' });
        }
      }


      const gmail = google.gmail({ version: 'v1', auth: oauth2Client});

      // Fetch the attachment
      const response = await gmail.users.messages.attachments.get({
        userId: 'me',
        messageId: emailId,
        id: attachmentId,
      });
      console.log('response',response);
      const attachmentData = response.data;

      res.status(200).json({ data: attachmentData.data });

    
    }else{
      const cookies = cookie.parse(req.headers.cookie || '');
      const accessToken = cookies.access_token;
      const refreshToken = cookies.refresh_token;

      if (!accessToken || !refreshToken) {
        console.log('accessToken',accessToken);
        return res.status(401).json({ error: 'No OAuth tokens found' });
      }

      let oauth2Client = getOAuth2Client(accessToken, refreshToken);

      // Check if the access token is expired and refresh if needed
      try {
        await oauth2Client.getTokenInfo(accessToken);
      } catch {
        console.log('Access token expired or invalid, attempting to refresh...');
        try {
          const newAccessToken = await refreshAccessToken(oauth2Client);
          oauth2Client = getOAuth2Client(newAccessToken, refreshToken);
          // Update cookies with the new access token
          res.setHeader('Set-Cookie', [
            cookie.serialize('access_token', newAccessToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              maxAge: 60 * 60 * 24 * 7, // 1 week
              sameSite: 'strict',
              path: '/'
            })
          ]);
        } catch (refreshError) {
          console.error('Failed to refresh access token, redirecting to authentication:', refreshError);
          return res.status(401).json({ error: 'auth_required', message: 'Please authenticate again' });
        }
      }


      const gmail = google.gmail({ version: 'v1', auth: oauth2Client});

      // Fetch the attachment
      const response = await gmail.users.messages.attachments.get({
        userId: 'me',
        messageId: emailId,
        id: attachmentId,
      });
      console.log('response',response);
      const attachmentData = response.data;

      res.status(200).json({ data: attachmentData.data });

    }
    
  } catch (error) {
    console.error('Error fetching attachment:', error);
    res.status(500).json({ error: 'Failed to fetch attachment' });
  }
}
