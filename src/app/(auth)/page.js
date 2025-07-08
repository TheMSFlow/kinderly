'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import KinderlyText from '@/components/common/KinderlyText';

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push('/login');
    }, 2000); // 2 seconds

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <section className="flex flex-col items-center justify-center w-full min-h-screen bg-bg-primary text-text-primary">
      <KinderlyText />
    </section>
  );
};

export default Home;
