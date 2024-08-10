import axios from 'axios';

export async function verifyToken(accessToken) {
  try {
    console.log('accessToken from verify api',accessToken);
    const response = await axios.get(`https://www.googleapis.com/oauth2/v2/tokeninfo?access_token=${accessToken}`);
    console.log('Token Info:', response.data);
  } catch (error) {
    console.error('Error verifying token:', error.response?.data || error.message);
  }
}
// src/lib/utils.js

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
