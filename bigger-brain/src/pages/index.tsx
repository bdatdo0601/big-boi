import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (window.location.hostname.includes('blogs')) {
      router.replace('/blogs');
    }
  }, [router]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Head>
        <title>Dat Do Blogs & Docs</title>
        <meta name="description" content="Displaying content of Dat's blogs and docs" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="flex flex-col items-center justify-center gap-4">
        <Link href="/blogs">Blogs</Link>
      </div>
    </div>
  );
}
