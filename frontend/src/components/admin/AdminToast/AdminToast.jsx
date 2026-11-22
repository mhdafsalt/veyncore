'use client';

import React from 'react';
import './AdminToast.css';

export default function AdminToast({ toast }) {
  if (!toast) return null;

  return (
    <div
      className={`admin-toast admin-toast--${toast.type || 'success'}`}
      role="alert"
    >
      <span>{toast.message}</span>
    </div>
  );
}
