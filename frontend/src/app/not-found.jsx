import Link from 'next/link';
import Container from '@/components/layout/Container';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <Container>
      <div className="hero-section">
        <span className="badge badge-error">404 Error</span>
        <h1 className="hero-title">Page Not Found</h1>
        <p className="hero-description">
          The requested page could not be found. Please check the URL or navigate back to the homepage.
        </p>
        <Link href="/">
          <Button variant="primary">Return to Homepage</Button>
        </Link>
      </div>
    </Container>
  );
}
