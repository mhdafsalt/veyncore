/**
 * Application Constants
 */

export const getApiBaseUrl = () => {
  // 1. If explicit environment variable is set, always respect it
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '');
  }

  // 2. In browser on localhost / 127.0.0.1, default to local backend
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:5000';
    }
  }

  // 3. In production (Vercel / deployed), default to production backend
  return 'https://veyncore.vercel.app';
};

export const API_BASE_URL = getApiBaseUrl();

export const WHATSAPP_NUMBER = '919446391166';

export const APP_METADATA = {
  title: 'Veyncore Full-Stack Application',
  description:
    'Clean, scalable, professional full-stack web application built with Next.js App Router and Express MVC.',
};

export const TECH_STACK = {
  frontend: [
    'Next.js (App Router)',
    'JavaScript & JSX only',
    'Native CSS Design System',
    'Modular Component Architecture',
    '@/ Path Aliases',
  ],
  backend: [
    'Node.js & Express.js',
    'MVC Architecture',
    'MongoDB Atlas with Mongoose',
    'RESTful API Endpoints',
    'ES Modules (import/export)',
  ],
};
