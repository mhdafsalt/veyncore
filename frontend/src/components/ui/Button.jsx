export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
  type = 'button',
}) {
  const variantClass = variant === 'secondary' ? 'btn-secondary' : 'btn-primary';
  const sizeClass = size === 'sm' ? 'btn-sm' : '';

  return (
    <button
      type={type}
      className={`btn ${variantClass} ${sizeClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
