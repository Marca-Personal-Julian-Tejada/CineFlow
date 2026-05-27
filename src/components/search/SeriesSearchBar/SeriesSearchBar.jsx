import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import useDebounce from '@/hooks/useDebounce';
import { searchTV } from '@/services/tmdb';
import './SeriesSearchBar.css';

const SeriesSearchBar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [input, setInput] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(input, 500);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const controller = new AbortController();
        const data = await searchTV({ query: debouncedQuery, page: 1 }, controller.signal);
        setResults((data.results || []).slice(0, 6));
      } catch (err) {
        if (err.name !== 'AbortError') {
          setResults([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = input.trim();
    if (q) {
      const params = new URLSearchParams(searchParams);
      params.set('q', q);
      params.set('page', '1');
      setSearchParams(params);
      setShowResults(false);
    }
  };

  const handleResultClick = (seriesId, seriesName) => {
    setInput(seriesName);
    const params = new URLSearchParams(searchParams);
    params.set('q', seriesName);
    params.set('page', '1');
    setSearchParams(params);
    setShowResults(false);
  };

  const handleClear = () => {
    setInput('');
    setResults([]);
    setShowResults(false);
    const params = new URLSearchParams(searchParams);
    params.delete('q');
    params.set('page', '1');
    setSearchParams(params);
  };

  return (
    <div className="series-search">
      <div className="container">
        <div className="series-search__inner">
          <form className="series-search__form" onSubmit={handleSubmit} role="search">
            <label htmlFor="series-search-input" className="sr-only">
              Buscar series
            </label>
            <div className="series-search__field">
              <svg
                className="series-search__icon"
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
                id="series-search-input"
                className="series-search__input"
                type="search"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setShowResults(true);
                }}
                onFocus={() => setShowResults(true)}
                placeholder="¿Qué serie buscas?"
                autoComplete="off"
              />
              {input && (
                <button
                  className="series-search__clear"
                  type="button"
                  onClick={handleClear}
                  aria-label="Limpiar búsqueda"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
            <button className="series-search__btn" type="submit" aria-label="Buscar serie">
              Buscar
            </button>
          </form>

          {showResults && input && (
            <div className="series-search__dropdown">
              {isLoading ? (
                <div className="series-search__loading">Buscando...</div>
              ) : results.length > 0 ? (
                <ul className="series-search__list">
                  {results.map((series) => (
                    <li key={series.id}>
                      <button
                        type="button"
                        className="series-search__result"
                        onClick={() => handleResultClick(series.id, series.name)}
                      >
                        <span className="series-search__result-name">{series.name}</span>
                        {series.first_air_date && (
                          <span className="series-search__result-year">
                            {series.first_air_date.slice(0, 4)}
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="series-search__empty">No se encontraron series</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeriesSearchBar;
