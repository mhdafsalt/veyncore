import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="site-header">
      <nav className="nav-container">
        <Link href="/" className="nav-brand">
          <span className="brand-dot"></span>
          <span>Veyncore</span>
        </Link>
        <ul className="nav-links">
          <li>
            <Link href="/" className="nav-link">
              Home
            </Link>
          </li>
          <li>
            <a
              href="http://localhost:5000/api/health"
              target="_blank"
              rel="noreferrer"
              className="nav-link"
            >
              API Endpoint ↗
            </a>
          </li>
          <li>
            <span className="badge">v1.0.0</span>
          </li>
        </ul>
      </nav>
    </header>
  );
}
