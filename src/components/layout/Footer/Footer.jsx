import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer__container container">
      <div className="footer__brand">
        <Link to="/" className="footer__logo" aria-label="CineFlow - Inicio">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <rect x="2" y="2" width="20" height="20" rx="2" ry="2" />
            <line x1="7" y1="2" x2="7" y2="22" />
            <line x1="17" y1="2" x2="17" y2="22" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <line x1="2" y1="7" x2="7" y2="7" />
            <line x1="17" y1="7" x2="22" y2="7" />
            <line x1="17" y1="17" x2="22" y2="17" />
            <line x1="2" y1="17" x2="7" y2="17" />
          </svg>
          <span>CineFlow</span>
        </Link>
      </div>

      <nav className="footer__nav" aria-label="Navegación del pie de página">
        <Link to="/" className="footer__link">Inicio</Link>
        <Link to="/generos" className="footer__link">Géneros</Link>
        <Link to="/mi-biblioteca" className="footer__link">Mi Biblioteca</Link>
      </nav>

      <p className="footer__credit">
        © {new Date().getFullYear()} CineFlow. Datos de{' '}
        <a
          href="https://www.themoviedb.org"
          target="_blank"
          rel="noopener noreferrer"
          className="footer__tmdb-link"
          aria-label="The Movie Database (abre en nueva pestaña)"
        >
          TMDB
        </a>
      </p>
    </div>
  </footer>
);

export default Footer;
