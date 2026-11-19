export default function Card({ title, description, icon, items = [], className = '' }) {
  return (
    <div className={`card ${className}`}>
      {icon && <span className="card-icon">{icon}</span>}
      <h3 className="card-title">{title}</h3>
      {description && <p className="card-text">{description}</p>}
      {items.length > 0 && (
        <ul className="card-list">
          {items.map((item, idx) => (
            <li key={idx}>
              <span>✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
