import { supabase } from './supabaseClient';


export const logout = async (e) => {
  e.preventDefault(); // Prevent the default link behavior
  const { error } = await supabase.auth.signOut();
  localStorage.removeItem('searchResults');
  localStorage.removeItem('selectedData');
  if (error) {
    console.error('Error signing out:', error.message);
  } else {
    // Optionally, redirect to the login page after logging out
    window.location.href = '/auth/login';
  }
};
