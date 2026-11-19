/**
 * Responsive layout container
 */
export default function Container({ children, className = '' }) {
  return <div className={`page-wrapper ${className}`}>{children}</div>;
}
