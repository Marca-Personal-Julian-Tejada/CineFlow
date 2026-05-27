import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const navLinkClass = ({ isActive }) =>
    `navbar__link${isActive ? ' navbar__link--active' : ''}`;

  return (
    <header className="navbar">
      <div className="navbar__container container">

        {/* Logo */}
        <NavLink to="/" className="navbar__logo" aria-label="CineFlow - Películas">
          <svg width="26" height="26" viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <rect x="3" y="7" width="58" height="50" rx="6" stroke="#CA8A04" strokeWidth="4"/>
            <rect x="5" y="13" width="8" height="9" rx="2" fill="#CA8A04"/>
            <rect x="5" y="27" width="8" height="9" rx="2" fill="#CA8A04"/>
            <rect x="5" y="41" width="8" height="9" rx="2" fill="#CA8A04"/>
            <rect x="51" y="13" width="8" height="9" rx="2" fill="#CA8A04"/>
            <rect x="51" y="27" width="8" height="9" rx="2" fill="#CA8A04"/>
            <rect x="51" y="41" width="8" height="9" rx="2" fill="#CA8A04"/>
            <polygon points="26,20 26,44 46,32" fill="#CA8A04"/>
          </svg>
          <span className="navbar__logo-text">CineFlow</span>
        </NavLink>

        {/* Nav links */}
        <nav
          className={`navbar__nav${menuOpen ? ' navbar__nav--open' : ''}`}
          aria-label="Navegación principal"
        >
          <NavLink to="/" className={navLinkClass} onClick={() => setMenuOpen(false)}>Películas</NavLink>
          <NavLink to="/series" className={navLinkClass} onClick={() => setMenuOpen(false)}>Series</NavLink>
          <NavLink to="/generos" className={navLinkClass} onClick={() => setMenuOpen(false)}>Géneros</NavLink>
          <NavLink to="/actores" className={navLinkClass} onClick={() => setMenuOpen(false)}>Actores</NavLink>
          <NavLink to="/mi-biblioteca" className={navLinkClass} onClick={() => setMenuOpen(false)}>Mi Biblioteca</NavLink>
        </nav>

        {/* Acciones */}
        <div className="navbar__actions">
          {/* Burger mobile */}
          <button
            className={`navbar__burger${menuOpen ? ' navbar__burger--open' : ''}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
            type="button"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
