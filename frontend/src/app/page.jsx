'use client';

import Container from '@/components/layout/Container';
import Header from '@/components/common/Header';
import StatusBadge from '@/components/common/StatusBadge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import useHealthCheck from '@/hooks/useHealthCheck';
import { API_BASE_URL, TECH_STACK } from '@/lib/constants';
import { formatDate } from '@/lib/utils';

export default function HomePage() {
  const { data, loading, error, lastChecked, refetch } = useHealthCheck(true);

  return (
    <Container>
      {/* Hero Header */}
      <Header
        badge="Ready for Development"
        title="Scalable Enterprise"
        subtitle="A clean, modular foundation engineered with Next.js App Router, Express MVC, and MongoDB Atlas."
      />

      {/* Backend Health Check Verification Panel */}
      <section className="health-panel">
        <div className="health-panel-header">
          <div>
            <h2 className="health-panel-title">
              <span>Backend Connectivity</span>
              {loading ? (
                <StatusBadge status="loading" label="Connecting..." />
              ) : error ? (
                <StatusBadge status="error" label="Offline / Error" />
              ) : (
                <StatusBadge status="success" label="Connected" />
              )}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
              Verifying communications with <code>{API_BASE_URL}/health</code>
            </p>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => refetch(true)}
            disabled={loading}
          >
            {loading ? 'Pinging API...' : '↻ Test Health Endpoint'}
          </Button>
        </div>

        {/* Status Output Console */}
        <div className="health-status-box">
          {loading && <div>Querying backend health endpoint...</div>}

          {!loading && error && (
            <div style={{ color: 'var(--error)' }}>
              <strong>Connection Error:</strong> {error}
              <div style={{ fontSize: '0.8rem', marginTop: '6px', color: 'var(--text-muted)' }}>
                Ensure your backend server is running on port 5000:
                <br />
                <code>cd backend && npm run dev</code>
              </div>
            </div>
          )}

          {!loading && data && (
            <div>
              <div style={{ color: 'var(--success)', marginBottom: '8px' }}>
                ✓ {data.message || 'Backend API is running'}
              </div>
              <pre style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Metadata Details */}
        <div className="health-status-meta">
          <div className="meta-item">
            <div className="meta-label">API Base URL</div>
            <div className="meta-value" style={{ fontSize: '0.85rem' }}>{API_BASE_URL}</div>
          </div>
          <div className="meta-item">
            <div className="meta-label">Backend Status</div>
            <div className="meta-value">
              {loading ? 'Checking...' : error ? 'Offline' : 'Active (200 OK)'}
            </div>
          </div>
          <div className="meta-item">
            <div className="meta-label">Database Connection</div>
            <div className="meta-value">
              {data?.database ? data.database.toUpperCase() : 'Check .env'}
            </div>
          </div>
          <div className="meta-item">
            <div className="meta-label">Last Checked</div>
            <div className="meta-value">{lastChecked ? formatDate(lastChecked) : 'Pending'}</div>
          </div>
        </div>
      </section>

      {/* Tech Stack Architectural Highlights */}
      <section className="cards-grid">
        <Card
          icon="⚡"
          title="Frontend Architecture"
          description="Next.js App Router built with pure JavaScript, JSX, and native CSS. Configured with @/ path aliases and modular component hierarchy."
          items={TECH_STACK.frontend}
        />

        <Card
          icon="⚙️"
          title="Backend MVC Architecture"
          description="Express.js RESTful API using Model-View-Controller design. Clean separation of controllers, routes, middleware, and services."
          items={TECH_STACK.backend}
        />

        <Card
          icon="🍃"
          title="Database & Environment"
          description="MongoDB Atlas integration using Mongoose with robust connection handling, secure credentials isolation, and .env configuration."
          items={[
            'Mongoose Schema & Models',
            'Connection state diagnostics',
            'Environment variables isolation',
            'CORS security configured',
          ]}
        />
      </section>
    </Container>
  );
}
