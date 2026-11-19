export default function StatusBadge({ status, label }) {
  const getBadgeClass = () => {
    switch (status) {
      case 'success':
      case 'connected':
        return 'badge-success';
      case 'error':
      case 'disconnected':
      case 'failed':
        return 'badge-error';
      case 'warning':
      case 'loading':
        return 'badge-warning';
      default:
        return '';
    }
  };

  return <span className={`badge ${getBadgeClass()}`}>{label}</span>;
}
