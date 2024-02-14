import { useRouter } from 'next/router';

export default function Home() {
  // Use useRouter to access the router object
  const router = useRouter();
  useEffect(() => {
    router.push('/home');
  }, []);

  // This page will never be rendered, as it redirects before rendering
  return null;
}

