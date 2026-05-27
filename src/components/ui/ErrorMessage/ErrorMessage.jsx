import './ErrorMessage.css';

const ErrorMessage = ({ message = 'Ocurrió un error inesperado.', onRetry }) => (
  <div className="error-message" role="alert">
    <div className="error-message__icon" aria-hidden="true">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    </div>
    <p className="error-message__text">{message}</p>
    {onRetry && (
      <button className="error-message__btn" onClick={onRetry} type="button">
        Intentar de nuevo
      </button>
    )}
  </div>
);

export default ErrorMessage;
