'use client';

import React from 'react';
import AnnouncementBar from '@/components/AnnouncementBar/AnnouncementBar';
import Navbar from '@/components/Navbar/Navbar';
import AuthPage from '@/components/Account/AuthPage';
import Footer from '@/components/Footer/Footer';

export default function AccountLoginPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main>
        <AuthPage />
      </main>
      <Footer />
    </>
  );
}