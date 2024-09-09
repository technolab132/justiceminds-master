// import { google } from 'googleapis';
// import cookie from 'cookie';

// const getOAuth2Client = (accessToken, refreshToken) => {
//   const oauth2Client = new google.auth.OAuth2(
//     process.env.GOOGLE_CLIENT_ID,
//     process.env.GOOGLE_CLIENT_SECRET,
//     `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback` // Ensure this matches your redirect URI
//   );

//   oauth2Client.setCredentials({
//     access_token: accessToken,
//     refresh_token: refreshToken,
//   });

//   return oauth2Client;
// };

// const refreshAccessToken = async (oauth2Client) => {
//   try {
//     const { credentials } = await oauth2Client.refreshToken(oauth2Client.credentials.refresh_token);
//     return credentials.access_token;
//   } catch (error) {
//     console.error('Error refreshing access token:', error.response ? error.response.data : error.message);
//     throw new Error('Failed to refresh access token');
//   }
// };

// export default async function handler(req, res) {
//   if (req.method !== 'GET') {
//     return res.status(405).json({ error: 'Method not allowed' });
//   }

//   try {
//     const cookies = cookie.parse(req.headers.cookie || '');
//     const accessToken = cookies.access_token;
//     const refreshToken = cookies.refresh_token;

//     if (!accessToken || !refreshToken) {
//       return res.status(401).json({ error: 'No OAuth tokens found' });
//     }

//     let oauth2Client = getOAuth2Client(accessToken, refreshToken);

//     // Check if the access token is expired and refresh if needed
//     try {
//       await oauth2Client.getTokenInfo(accessToken);
//     } catch {
//       console.log('Access token expired or invalid, attempting to refresh...');
//       try {
//         const newAccessToken = await refreshAccessToken(oauth2Client);
//         oauth2Client = getOAuth2Client(newAccessToken, refreshToken);
//         // Update cookies with the new access token
//         res.setHeader('Set-Cookie', [
//           cookie.serialize('access_token', newAccessToken, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             maxAge: 60 * 60 * 24 * 7, // 1 week
//             sameSite: 'strict',
//             path: '/'
//           })
//         ]);
//       } catch (refreshError) {
//         console.error('Failed to refresh access token, redirecting to authentication:', refreshError);
//         return res.status(401).json({ error: 'auth_required', message: 'Please authenticate again' });
//       }
//     }

//     const label = req.query.label;
//     const pageToken = req.query.pageToken || null;

//     const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

//     const gmailResponse = await gmail.users.messages.list({
//       userId: 'me',
//       q: `label:${label}`,
//       maxResults: 100,
//       pageToken,
//     });

//     const uniqueClients = new Map();

//     await Promise.all(
//       gmailResponse.data.messages.map(async (message) => {
//         const email = await gmail.users.messages.get({ userId: 'me', id: message.id });
//         const headers = email.data.payload.headers;
//         const fromHeader = headers.find(header => header.name === 'From');
//         if (fromHeader) {
//           const nameEmailMatch = fromHeader.value.match(/(.+?)\s*<(.+?)>/);
//           if (nameEmailMatch && nameEmailMatch.length === 3) {
//             const name = nameEmailMatch[1].trim();
//             const emailAddress = nameEmailMatch[2];
//             if (!uniqueClients.has(emailAddress)) {
//               uniqueClients.set(emailAddress, name);
//             }
//           } else {
//             const emailAddressMatch = fromHeader.value.match(/<(.+?)>/);
//             if (emailAddressMatch && emailAddressMatch.length === 2) {
//               const emailAddress = emailAddressMatch[1];
//               if (!uniqueClients.has(emailAddress)) {
//                 uniqueClients.set(emailAddress, '');
//               }
//             }
//           }
//         }
//       })
//     );

//     res.status(200).json({ 
//       uniqueClients: Array.from(uniqueClients.entries()).map(([email, name]) => ({ email, name })),
//       nextPageToken: gmailResponse.data.nextPageToken || null
//     });
//   } catch (error) {
//     console.error('Error fetching emails:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// }

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
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const cookies = cookie.parse(req.headers.cookie || '');
    const accessToken = cookies.access_token;
    const refreshToken = cookies.refresh_token;

    if (!accessToken || !refreshToken) {
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

    const label = req.query.label;
    const pageToken = req.query.pageToken || null;

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    const gmailResponse = await gmail.users.messages.list({
      userId: 'me',
      q: `label:${label}`,
      maxResults: 100,
      pageToken,
    });

    const uniqueClients = new Map();

    await Promise.all(
      gmailResponse.data.messages.map(async (message) => {
        const email = await gmail.users.messages.get({ userId: 'me', id: message.id });
        const headers = email.data.payload.headers;
        const fromHeader = headers.find(header => header.name === 'From');
        if (fromHeader) {
          const nameEmailMatch = fromHeader.value.match(/(.+?)\s*<(.+?)>/);
          if (nameEmailMatch && nameEmailMatch.length === 3) {
            const name = nameEmailMatch[1].trim();
            const emailAddress = nameEmailMatch[2];
            if (!uniqueClients.has(emailAddress)) {
              uniqueClients.set(emailAddress, name);
            }
          } else {
            const emailAddressMatch = fromHeader.value.match(/<(.+?)>/);
            if (emailAddressMatch && emailAddressMatch.length === 2) {
              const emailAddress = emailAddressMatch[1];
              if (!uniqueClients.has(emailAddress)) {
                uniqueClients.set(emailAddress, '');
              }
            }
          }
        }
      })
    );

    // Convert the map to an array and sort by name
    const sortedClients = Array.from(uniqueClients.entries())
    .map(([email, name]) => {
      // Sanitize name by trimming extra quotes or spaces
      const sanitizedName = name.replace(/^["']|["']$/g, '').trim();
      return { email, name: sanitizedName };
    })
    .sort((a, b) => a.name.localeCompare(b.name));


    res.status(200).json({
      uniqueClients: sortedClients,
      nextPageToken: gmailResponse.data.nextPageToken || null
    });
  } catch (error) {
    console.error('Error fetching emails:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
