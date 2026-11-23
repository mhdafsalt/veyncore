'use client';

import React from 'react';
import './AdminToast.css';

export default function AdminToast({ toast }) {
  if (!toast) return null;

  return (
    <div className={`admin-toast admin-toast--${toast.type}`} role="status">
      <span className="admin-toast__icon">
        {toast.type === 'success' ? '✓' : '⚠️'}
      </span>
      <span className="admin-toast__message">{toast.message}</span>
    </div>
  );
}
