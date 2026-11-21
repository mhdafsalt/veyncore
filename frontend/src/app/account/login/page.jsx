'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AccountLoginPage() {
  const router = useRouter();
  const { openAuthModal } = useAuth();

  useEffect(() => {
    // No separate page for signup and login - redirect to home and pop open modal
    router.replace('/');
    openAuthModal('login');
  }, [router, openAuthModal]);

  return null;
}
