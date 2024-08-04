import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../utils/supabaseClient';
import Cookies from 'js-cookie';

const Callback = () => {
  const router = useRouter();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error handling auth callback:', error.message);
        return;
      }

      if (data?.session) {
        const accessToken = data.session.provider_token;
        const refreshToken = data.session.refresh_token;

        Cookies.set('access_token', accessToken, { expires: 7, secure: true, sameSite: 'Strict' });
        Cookies.set('refresh_token', refreshToken, { expires: 7, secure: true, sameSite: 'Strict' });
      }

      router.push('/dashboard');
    };

    handleOAuthCallback();
  }, [router]);

  return <div>Loading...</div>;
};

export default Callback;
