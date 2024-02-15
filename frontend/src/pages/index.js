import { useRouter } from 'next/router';
import { useEffect } from 'react';
import HomeLayout from 'src/@core/layouts/HomeLayout'

const Home = () => {
  // Use useRouter to access the router object
  const router = useRouter();
  useEffect(() => {
    router.push('/home');
  }, []);

  // This page will never be rendered, as it redirects before rendering
  return null;
}

Home.getLayout = page => <HomeLayout>{page}</HomeLayout>
Home.guestGuard = true

export default Home
