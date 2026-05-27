import { useState, useEffect } from 'react';
import { getGenres } from '@/services/tmdb';
import { YEAR_OPTIONS, RATING_OPTIONS } from '@/constants/app';
import './FilterBar.css';

const FilterBar = ({ activeFilters, onFilterChange }) => {
  const [genres, setGenres] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    getGenres().then((data) => {
      if (data?.genres) setGenres(data.genres);
    }).catch(() => {});
  }, []);

  const toggleDropdown = (name) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const handleSelect = (type, value) => {
    onFilterChange(type, value);
    setOpenDropdown(null);
  };

  const getGenreLabel = () => {
    if (!activeFilters.genre) return 'Género';
    const g = genres.find((g) => g.id === activeFilters.genre);
    return g ? g.name : 'Género';
  };

  const getYearLabel = () => {
    return activeFilters.year ? String(activeFilters.year) : 'Año';
  };

  const getRatingLabel = () => {
    return activeFilters.rating ? `${activeFilters.rating}+` : 'Calificación';
  };

  const hasActiveFilters = activeFilters.genre || activeFilters.year || activeFilters.rating;

  return (
    <div className="filter-bar">
      <span className="filter-bar__label">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
        Filtros
      </span>

      {/* Género */}
      <div className="filter-dropdown">
        <button
          className={`filter-pill${activeFilters.genre ? ' filter-pill--active' : ''}`}
          onClick={() => toggleDropdown('genre')}
          aria-expanded={openDropdown === 'genre'}
          aria-haspopup="listbox"
          type="button"
        >
          {getGenreLabel()}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        {openDropdown === 'genre' && (
          <ul className="filter-dropdown__list" role="listbox" aria-label="Seleccionar género">
            <li role="option" aria-selected={!activeFilters.genre}>
              <button className="filter-dropdown__option" onClick={() => handleSelect('genre', null)} type="button">
                Todos los géneros
              </button>
            </li>
            {genres.map((g) => (
              <li key={g.id} role="option" aria-selected={activeFilters.genre === g.id}>
                <button
                  className={`filter-dropdown__option${activeFilters.genre === g.id ? ' filter-dropdown__option--selected' : ''}`}
                  onClick={() => handleSelect('genre', g.id)}
                  type="button"
                >
                  {g.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Año */}
      <div className="filter-dropdown">
        <button
          className={`filter-pill${activeFilters.year ? ' filter-pill--active' : ''}`}
          onClick={() => toggleDropdown('year')}
          aria-expanded={openDropdown === 'year'}
          aria-haspopup="listbox"
          type="button"
        >
          {getYearLabel()}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        {openDropdown === 'year' && (
          <ul className="filter-dropdown__list filter-dropdown__list--year" role="listbox" aria-label="Seleccionar año">
            {YEAR_OPTIONS.map((opt) => (
              <li key={opt.value ?? 'all'} role="option" aria-selected={activeFilters.year === opt.value}>
                <button
                  className={`filter-dropdown__option${activeFilters.year === opt.value ? ' filter-dropdown__option--selected' : ''}`}
                  onClick={() => handleSelect('year', opt.value)}
                  type="button"
                >
                  {opt.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Calificación */}
      <div className="filter-dropdown">
        <button
          className={`filter-pill${activeFilters.rating ? ' filter-pill--active' : ''}`}
          onClick={() => toggleDropdown('rating')}
          aria-expanded={openDropdown === 'rating'}
          aria-haspopup="listbox"
          type="button"
        >
          {getRatingLabel()}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        {openDropdown === 'rating' && (
          <ul className="filter-dropdown__list" role="listbox" aria-label="Seleccionar calificación mínima">
            {RATING_OPTIONS.map((opt) => (
              <li key={opt.value ?? 'all'} role="option" aria-selected={activeFilters.rating === opt.value}>
                <button
                  className={`filter-dropdown__option${activeFilters.rating === opt.value ? ' filter-dropdown__option--selected' : ''}`}
                  onClick={() => handleSelect('rating', opt.value)}
                  type="button"
                >
                  {opt.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {hasActiveFilters && (
        <button
          className="filter-clear"
          onClick={() => onFilterChange('clear', null)}
          type="button"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
};

export default FilterBar;
