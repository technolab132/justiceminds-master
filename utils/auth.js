import { supabase } from './supabaseClient';

const cookie = require('cookie');
export const clearCookies = () => {
  const cookies = cookie.parse(document.cookie);
  for (const cookieName in cookies) {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
  }
};

export const logout = async (e) => {
  e.preventDefault(); // Prevent the default link behavior
  const { error } = await supabase.auth.signOut();
  localStorage.removeItem('searchResults');
  localStorage.removeItem('selectedData');
  
  clearCookies(); // Clear cookies on logout

  if (error) {
    console.error('Error signing out:', error.message);
  } else {
    // Optionally, redirect to the login page after logging out
    window.location.href = '/auth/login';
  }
};
