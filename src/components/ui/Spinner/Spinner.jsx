import './Spinner.css';

const Spinner = ({ size = 'medium', label = 'Cargando...' }) => (
  <div className={`spinner spinner--${size}`} role="status" aria-label={label}>
    <div className="spinner__circle" />
    <span className="sr-only">{label}</span>
  </div>
);

export default Spinner;
