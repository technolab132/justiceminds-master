// utils/withAuth.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      const checkUser = async () => {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
          router.replace('/auth/login'); // Redirect to auth page if not authenticated
        }
      };

      checkUser();
    }, [router]);

    // if (!isAuthenticated) {
    //   return null; // You can return a loading spinner here if you like
    // }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
