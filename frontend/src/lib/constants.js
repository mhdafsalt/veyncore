/**
 * Application Constants
 */

export const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    }
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
};

export const API_BASE_URL = getApiBaseUrl();

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
