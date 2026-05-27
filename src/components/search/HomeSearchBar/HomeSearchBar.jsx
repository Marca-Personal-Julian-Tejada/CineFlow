import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomeSearchBar.css';

const SUGGESTIONS = [
  'Dune', 'Oppenheimer', 'Interstellar', 'El Padrino', 'Blade Runner',
];

const HomeSearchBar = () => {
  const [value, setValue] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = value.trim();
    if (q) {
      navigate(`/buscar?q=${encodeURIComponent(q)}`);
    }
  };

  const handleSuggestion = (term) => {
    navigate(`/buscar?q=${encodeURIComponent(term)}`);
  };

  return (
    <div className="home-search">
      <div className="container">
        <div className="home-search__inner">
          <form className="home-search__form" onSubmit={handleSubmit} role="search">
            <label htmlFor="home-search-input" className="sr-only">
              Buscar películas
            </label>
            <div className="home-search__field">
              <svg
                className="home-search__icon"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                id="home-search-input"
                className="home-search__input"
                type="search"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="¿Qué película estás buscando?"
                autoComplete="off"
              />
              {value && (
                <button
                  className="home-search__clear"
                  type="button"
                  onClick={() => setValue('')}
                  aria-label="Limpiar búsqueda"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
            <button className="home-search__btn" type="submit" aria-label="Buscar película">
              Buscar
            </button>
          </form>

          <div className="home-search__suggestions">
            <span className="home-search__suggestions-label">Populares:</span>
            {SUGGESTIONS.map((term) => (
              <button
                key={term}
                className="home-search__chip"
                type="button"
                onClick={() => handleSuggestion(term)}
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeSearchBar;
