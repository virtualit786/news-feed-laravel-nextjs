'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';


const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    console.log("Called");
    router?.push('/auth/login')
  }, [])

  return (
    <div></div>
  );
};

export default HomePage;