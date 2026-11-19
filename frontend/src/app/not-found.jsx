import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', fontFamily: 'inherit' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '16px', fontWeight: '700' }}>404 - Page Not Found</h1>
      <p style={{ color: '#666', marginBottom: '24px' }}>The page you are looking for does not exist.</p>
      <Link
        href="/"
        style={{
          display: 'inline-block',
          padding: '10px 24px',
          backgroundColor: '#000000',
          color: '#ffffff',
          borderRadius: '4px',
          textDecoration: 'none',
          fontWeight: '500',
          fontSize: '14px'
        }}
      >
        Return to Home
      </Link>
    </div>
  );
}
