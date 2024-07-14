// import { oAuth2ClientInstance } from '../../lib/gmailClient';
// import { promises as fs } from 'fs';
// import path from 'path';

// const TOKEN_PATH = path.join(process.cwd(), 'token.json');

// export async function GET(request) {
//   const oAuth2Client = oAuth2ClientInstance;

//   if (!oAuth2Client) {
//     return new Response('Unauthorized', { status: 401 });
//   }

//   const urlString = request.url.toString(); // Convert request.url to a string
//   const url = new URL(urlString); // Create a new URL instance from the string
//   const code = url.searchParams.get('code');

//   if (!code) {
//     console.error('Missing code parameter in URL:', urlString);
//     return new Response('Missing code parameter', { status: 400 });
//   }

//   try {
//     const { tokens } = await oAuth2Client.getToken(code);
//     oAuth2Client.setCredentials(tokens);

//     // Save the credentials to the token.json file
//     await fs.writeFile(TOKEN_PATH, JSON.stringify(tokens));

//     return new Response('Authorization successful', { status: 200 });
//   } catch (error) {
//     console.error('Error during authorization:', error);
//     return new Response('Authorization failed', { status: 500 });
//   }
// }

import React from 'react'

const oauth2callback = () => {
  return (
    <div>oauth2callback</div>
  )
}

export default oauth2callback