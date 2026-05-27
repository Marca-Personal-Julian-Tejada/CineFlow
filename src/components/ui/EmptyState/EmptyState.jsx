import './EmptyState.css';

const EmptyState = ({ title = 'Sin resultados', description = '', action }) => (
  <div className="empty-state">
    <div className="empty-state__icon" aria-hidden="true">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="2" width="20" height="20" rx="2" ry="2" />
        <path d="M7 8h10M7 12h6" />
        <circle cx="18" cy="18" r="4" fill="var(--color-bg)" />
        <line x1="16" y1="18" x2="20" y2="18" />
      </svg>
    </div>
    <h3 className="empty-state__title">{title}</h3>
    {description && <p className="empty-state__description">{description}</p>}
    {action && (
      <div className="empty-state__action">{action}</div>
    )}
  </div>
);

export default EmptyState;
