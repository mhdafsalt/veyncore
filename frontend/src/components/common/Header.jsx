export default function Header({ title, subtitle, badge }) {
  return (
    <div className="hero-section">
      {badge && <span className="badge">{badge}</span>}
      <h1 className="hero-title">
        {title}{' '}
        <span className="hero-title-highlight">Full-Stack Platform</span>
      </h1>
      {subtitle && <p className="hero-description">{subtitle}</p>}
    </div>
  );
}
