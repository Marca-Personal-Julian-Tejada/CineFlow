import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // En Home, el icono de búsqueda sólo se muestra en mobile (la HomeSearchBar cubre desktop)
  const isHome = location.pathname === '/';

  useEffect(() => {
    if (searchOpen && inputRef.current) inputRef.current.focus();
  }, [searchOpen]);

  // Cierra el search al cambiar de ruta
  useEffect(() => {
    setSearchOpen(false);
    setSearchValue('');
    setMenuOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchValue.trim();
    if (q) {
      navigate(`/buscar?q=${encodeURIComponent(q)}`);
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Escape') {
      setSearchOpen(false);
      setSearchValue('');
    }
  };

  const navLinkClass = ({ isActive }) =>
    `navbar__link${isActive ? ' navbar__link--active' : ''}`;

  return (
    <header className="navbar">
      <div className="navbar__container container">

        {/* Logo */}
        <NavLink to="/" className="navbar__logo" aria-label="CineFlow - Inicio">
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
          <NavLink to="/" className={navLinkClass} onClick={() => setMenuOpen(false)}>Inicio</NavLink>
          <NavLink to="/generos" className={navLinkClass} onClick={() => setMenuOpen(false)}>Géneros</NavLink>
          <NavLink to="/actores" className={navLinkClass} onClick={() => setMenuOpen(false)}>Actores</NavLink>
          <NavLink to="/mi-biblioteca" className={navLinkClass} onClick={() => setMenuOpen(false)}>Mi Biblioteca</NavLink>
        </nav>

        {/* Acciones */}
        <div className="navbar__actions">
          {/* Icono búsqueda: siempre en mobile; en desktop sólo cuando NO es Home */}
          <div className={`navbar__search-wrapper${isHome ? ' navbar__search-wrapper--home' : ''}`}>
            {searchOpen ? (
              <form className="navbar__search-form" onSubmit={handleSearchSubmit} role="search">
                <input
                  ref={inputRef}
                  className="navbar__search-input"
                  type="search"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Buscar películas..."
                  aria-label="Buscar películas"
                />
                <button type="submit" className="navbar__search-btn" aria-label="Buscar">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="navbar__search-btn"
                  onClick={() => { setSearchOpen(false); setSearchValue(''); }}
                  aria-label="Cerrar búsqueda"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </form>
            ) : (
              <button
                className="navbar__icon-btn"
                onClick={() => setSearchOpen(true)}
                aria-label="Abrir búsqueda"
                type="button"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>
            )}
          </div>

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
