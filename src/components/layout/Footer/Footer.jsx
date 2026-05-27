import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer__container container">
      <div className="footer__content">
        {/* Brand */}
        <div className="footer__section">
          <Link to="/" className="footer__logo" aria-label="CineFlow - Inicio">
            <svg width="24" height="24" viewBox="0 0 64 64" fill="none" aria-hidden="true">
              <rect x="3" y="7" width="58" height="50" rx="6" stroke="#CA8A04" strokeWidth="4"/>
              <rect x="5" y="13" width="8" height="9" rx="2" fill="#CA8A04"/>
              <rect x="5" y="27" width="8" height="9" rx="2" fill="#CA8A04"/>
              <rect x="5" y="41" width="8" height="9" rx="2" fill="#CA8A04"/>
              <rect x="51" y="13" width="8" height="9" rx="2" fill="#CA8A04"/>
              <rect x="51" y="27" width="8" height="9" rx="2" fill="#CA8A04"/>
              <rect x="51" y="41" width="8" height="9" rx="2" fill="#CA8A04"/>
              <polygon points="26,20 26,44 46,32" fill="#CA8A04"/>
            </svg>
            <span>CineFlow</span>
          </Link>
          <p className="footer__tagline">Tu catálogo personal de películas y series</p>
        </div>

        {/* Películas */}
        <div className="footer__section">
          <h3 className="footer__section-title">Películas</h3>
          <nav className="footer__links" aria-label="Navegación de películas">
            <Link to="/" className="footer__link">Inicio (Home)</Link>
            <Link to="/buscar" className="footer__link">Buscar</Link>
            <Link to="/generos" className="footer__link">Géneros</Link>
          </nav>
        </div>

        {/* Series */}
        <div className="footer__section">
          <h3 className="footer__section-title">Series</h3>
          <nav className="footer__links" aria-label="Navegación de series">
            <Link to="/series" className="footer__link">Descubrir</Link>
            <Link to="/generos" className="footer__link">Géneros</Link>
          </nav>
        </div>

        {/* Biblioteca */}
        <div className="footer__section">
          <h3 className="footer__section-title">Mi Biblioteca</h3>
          <nav className="footer__links" aria-label="Navegación de biblioteca">
            <Link to="/mi-biblioteca" className="footer__link">Mis películas</Link>
            <Link to="/mi-biblioteca" className="footer__link">Actores</Link>
          </nav>
        </div>

        {/* Info */}
        <div className="footer__section">
          <h3 className="footer__section-title">Información</h3>
          <nav className="footer__links" aria-label="Enlaces de información">
            <a
              href="https://www.themoviedb.org"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__link"
              aria-label="TMDB (abre en nueva pestaña)"
            >
              TMDB API
            </a>
            <a
              href="https://www.themoviedb.org/terms-of-use"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__link"
              aria-label="Términos de uso (abre en nueva pestaña)"
            >
              Términos
            </a>
          </nav>
        </div>
      </div>

      <div className="footer__bottom">
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
    </div>
  </footer>
);

export default Footer;
