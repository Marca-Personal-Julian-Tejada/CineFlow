import { useState } from 'react';
import './SeriesFilterBar.css';

const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Popularidad descendente' },
  { value: 'popularity.asc', label: 'Popularidad ascendente' },
  { value: 'vote_average.desc', label: 'Valoración descendente' },
  { value: 'vote_average.asc', label: 'Valoración ascendente' },
  { value: 'first_air_date.desc', label: 'Más recientes' },
  { value: 'first_air_date.asc', label: 'Más antiguos' },
];

const AVAILABILITY_OPTIONS = [
  { value: 'free', label: 'Gratis' },
  { value: 'ads', label: 'Con anuncios' },
  { value: 'rent', label: 'Alquiler' },
  { value: 'buy', label: 'Compra' },
];

const SeriesFilterBar = ({ onFilterChange, genres = [], selectedGenres = [], selectedSort = 'popularity.desc' }) => {
  const [expanded, setExpanded] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [showAvailability, setShowAvailability] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [availability, setAvailability] = useState({});

  const handleSortChange = (value) => {
    onFilterChange({ sort_by: value });
    setSortOpen(false);
  };

  const handleGenreToggle = (genreId) => {
    const newGenres = selectedGenres.includes(genreId)
      ? selectedGenres.filter(id => id !== genreId)
      : [...selectedGenres, genreId];
    onFilterChange({ with_genres: newGenres.length > 0 ? newGenres.join(',') : null });
  };

  const handleAvailabilityToggle = (type) => {
    const newAvailability = { ...availability };
    newAvailability[type] = !newAvailability[type];
    setAvailability(newAvailability);
    const selected = Object.keys(newAvailability).filter(k => newAvailability[k]);
    onFilterChange({ with_watch_monetization_types: selected.length > 0 ? selected.join('|') : null });
  };

  const handleDateChange = (type, value) => {
    if (type === 'from') {
      setFromDate(value);
      onFilterChange({ 'first_air_date.gte': value || null });
    } else {
      setToDate(value);
      onFilterChange({ 'first_air_date.lte': value || null });
    }
  };

  const currentSort = SORT_OPTIONS.find(opt => opt.value === selectedSort);

  return (
    <div className="series-filters">
      <div className="series-filters__header">
        <button
          className="series-filters__toggle"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
        >
          Filtros
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <polyline points={expanded ? '18 15 12 9 6 15' : '6 9 12 15 18 9'} />
          </svg>
        </button>
        <span className="series-filters__count">
          {selectedGenres.length > 0 && `${selectedGenres.length} filtros activos`}
        </span>
      </div>

      {expanded && (
        <div className="series-filters__content">
          {/* Ordenar */}
          <div className="filter-section">
            <h3 className="filter-section__title">Ordenar resultados</h3>
            <div className="filter-section__dropdown">
              <button
                className="filter-dropdown__toggle"
                onClick={() => setSortOpen(!sortOpen)}
                aria-expanded={sortOpen}
              >
                {currentSort?.label || 'Popularidad descendente'}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <polyline points={sortOpen ? '18 15 12 9 6 15' : '6 9 12 15 18 9'} />
                </svg>
              </button>
              {sortOpen && (
                <div className="filter-dropdown__menu">
                  {SORT_OPTIONS.map(option => (
                    <button
                      key={option.value}
                      className={`filter-dropdown__item${selectedSort === option.value ? ' filter-dropdown__item--active' : ''}`}
                      onClick={() => handleSortChange(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Géneros */}
          {genres.length > 0 && (
            <div className="filter-section">
              <h3 className="filter-section__title">Géneros</h3>
              <div className="filter-section__tags">
                {genres.map(genre => (
                  <button
                    key={genre.id}
                    className={`filter-tag${selectedGenres.includes(genre.id) ? ' filter-tag--active' : ''}`}
                    onClick={() => handleGenreToggle(genre.id)}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Fechas de estreno */}
          <div className="filter-section">
            <h3 className="filter-section__title">Fechas de estreno</h3>
            <div className="filter-section__dates">
              <input
                type="date"
                className="filter-date-input"
                value={fromDate}
                onChange={(e) => handleDateChange('from', e.target.value)}
                aria-label="Desde fecha de estreno"
              />
              <span className="filter-dates__sep">–</span>
              <input
                type="date"
                className="filter-date-input"
                value={toDate}
                onChange={(e) => handleDateChange('to', e.target.value)}
                aria-label="Hasta fecha de estreno"
              />
            </div>
          </div>

          {/* Disponibilidad */}
          <div className="filter-section">
            <button
              className="filter-section__title filter-section__title--toggle"
              onClick={() => setShowAvailability(!showAvailability)}
              aria-expanded={showAvailability}
            >
              Disponibilidad
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <polyline points={showAvailability ? '18 15 12 9 6 15' : '6 9 12 15 18 9'} />
              </svg>
            </button>
            {showAvailability && (
              <div className="filter-section__checkboxes">
                {AVAILABILITY_OPTIONS.map(option => (
                  <label key={option.value} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={availability[option.value] || false}
                      onChange={() => handleAvailabilityToggle(option.value)}
                    />
                    <span className="filter-checkbox__label">{option.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SeriesFilterBar;
