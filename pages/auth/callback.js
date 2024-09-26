import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../utils/supabaseClient';
import Cookies from 'js-cookie';
import cookie from 'cookie';

const Callback = () => {
  const router = useRouter();

  // Define the superadmin email
  const superadminEmail = 'authority@justice-minds.com'; //'parthdawda9@gmail.com'; // Replace with the actual superadmin email

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Error handling auth callback:', error.message);
          return;
        }

        if (data.session) {
          const { provider_token: accessToken, provider_refresh_token: refreshToken, user } = data.session;
          // Get the expiry date from the session
          const expiryDate = new Date(data.session.expires_at * 1000).getTime().toString();

          // Set cookies with additional security options, including expiry date
          Cookies.set('access_token', accessToken, { expires: 7, secure: true, sameSite: 'Strict' });
          Cookies.set('refresh_token', refreshToken, { expires: 7, secure: true, sameSite: 'Strict' });
          Cookies.set('expiry_date', expiryDate, { expires: 7, secure: true, sameSite: 'Strict' });

          // // Set cookies with additional security options
          // Cookies.set('access_token', accessToken, { expires: 7, secure: true, sameSite: 'Strict' });
          // Cookies.set('refresh_token', refreshToken, { expires: 7, secure: true, sameSite: 'Strict' });

          // Check if the authenticated user's email matches the superadmin email
          if (user.email === superadminEmail) {
            // Update user metadata to set the role as superadmin
            const { error: updateError } = await supabase.auth.updateUser({
              data: { role: 'superadmin' }
            });

            if (updateError) {
              console.error('Error updating user role to superadmin:', updateError.message);
            } else {
              console.log('User role updated to superadmin');
            }

            // Redirect to the admin dashboard or any other superadmin page
            //router.push('/admin/dashboard');
            //return;
          }

          // Redirect to the regular dashboard for non-superadmin users
          router.push('/dashboard');
        } else {
          console.error('No session data found');
        }
      } catch (err) {
        console.error('Unexpected error during OAuth callback:', err.message);
      }
    };

    handleOAuthCallback();
  }, [router]);

  return <div>Loading...</div>;
};

export default Callback;

