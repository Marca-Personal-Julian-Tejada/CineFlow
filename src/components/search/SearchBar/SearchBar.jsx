import { useState, useEffect } from 'react';
import useDebounce from '@/hooks/useDebounce';
import './SearchBar.css';

const SearchBar = ({ initialValue = '', onSearch, placeholder = 'Buscar películas...' }) => {
  const [value, setValue] = useState(initialValue);
  const debouncedValue = useDebounce(value);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue]); // eslint-disable-line

  const handleClear = () => {
    setValue('');
    onSearch('');
  };

  return (
    <div className="search-bar" role="search">
      <label htmlFor="movie-search" className="sr-only">Buscar películas</label>
      <div className="search-bar__inner">
        <svg className="search-bar__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          id="movie-search"
          className="search-bar__input"
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
        />
        {value && (
          <button
            className="search-bar__clear"
            onClick={handleClear}
            type="button"
            aria-label="Limpiar búsqueda"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
