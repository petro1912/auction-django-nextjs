import { useRouter } from 'next/router';

export default function Home() {
  // Use useRouter to access the router object
  const router = useRouter();

  // This page will never be rendered, as it redirects before rendering
  return null;
}

// Define getServerSideProps to perform the server-side redirect
export async function getServerSideProps(context) {
  // Perform the redirect
  return {
    redirect: {
      destination: '/home',
      permanent: true, // Set permanent to true for a 301 redirect
    },
  };
}
