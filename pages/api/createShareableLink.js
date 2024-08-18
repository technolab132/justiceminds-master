import { google } from 'googleapis';
import { createToken } from '../../lib/tokenUtils'; // Utility to create token
import cookie from 'cookie';
export default async function handler(req, res) {
  const { Email,Name } = req.body;

  if (!Email) {
    return res.status(400).json({ error: 'Email ID is required' });
  }

  try {
    const cookies = cookie.parse(req.headers.cookie || '');
    const accessToken = cookies.access_token;
    const refreshToken = cookies.refresh_token;
    // Generate an OAuth2 client
    // const oauth2Client = new google.auth.OAuth2(
    //     process.env.GOOGLE_CLIENT_ID,
    //     process.env.GOOGLE_CLIENT_SECRET,
    // );

    // Generate an access token
    // const accessToken = await oauth2Client.getAccessToken();

    // // Encrypt the access token
    // console.log('accessToken',accessToken);
    // const encryptedToken = createToken(accessToken);
    // console.log('encryptedToken',encryptedToken);
    // // Create the shareable link
    // const shareableLink = `${process.env.NEXT_PUBLIC_REDIRECT_URL}/share/${encryptedToken.encryptedData}?emailId=${emailId}`;
    // Encrypt the access token
   // const { encryptedData: encryptedToken, iv: ivHex } = createToken(accessToken);

    // Create the shareable link, including the IV and email ID
    const shareableLink = `${process.env.NEXT_PUBLIC_REDIRECT_URL}/share/${accessToken}?refreshToken=${refreshToken}&emailId=${Email}&name=${Name}`;
  
    res.status(200).json({ shareableLink });
  } catch (error) {
    console.error('Error creating shareable link:', error);
    res.status(500).json({ error: 'Failed to create shareable link' });
  }
}
