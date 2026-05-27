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

const STREAMING_PROVIDERS = [
  { id: 8, name: 'Netflix' },
  { id: 9, name: 'Amazon Prime Video' },
  { id: 35, name: 'HBO Max' },
  { id: 15, name: 'Hulu' },
  { id: 337, name: 'Disney+' },
  { id: 192, name: 'Claro Video' },
  { id: 188, name: 'VIX (Pluto TV)' },
  { id: 1, name: 'Apple TV' },
  { id: 3, name: 'Google Play' },
  { id: 4, name: 'iTunes' },
];

const COUNTRIES = [
  { code: 'CO', name: 'Colombia' },
  { code: 'US', name: 'Estados Unidos' },
  { code: 'ES', name: 'España' },
  { code: 'MX', name: 'México' },
  { code: 'AR', name: 'Argentina' },
  { code: 'BR', name: 'Brasil' },
  { code: 'CL', name: 'Chile' },
  { code: 'PE', name: 'Perú' },
  { code: 'VE', name: 'Venezuela' },
  { code: 'GB', name: 'Reino Unido' },
  { code: 'FR', name: 'Francia' },
  { code: 'DE', name: 'Alemania' },
  { code: 'IT', name: 'Italia' },
  { code: 'JP', name: 'Japón' },
  { code: 'AU', name: 'Australia' },
  { code: 'CA', name: 'Canadá' },
];

const SeriesFilterBar = ({ onFilterChange, genres = [], selectedGenres = [], selectedSort = 'popularity.desc', selectedProviders = [], selectedCountry = 'CO' }) => {
  const [expanded, setExpanded] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [showAvailability, setShowAvailability] = useState(false);
  const [showProviders, setShowProviders] = useState(false);
  const [showCountries, setShowCountries] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [availability, setAvailability] = useState({});
  const [providers, setProviders] = useState({});

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

  const handleProviderToggle = (providerId) => {
    const newProviders = { ...providers };
    newProviders[providerId] = !newProviders[providerId];
    setProviders(newProviders);
    const selected = Object.keys(newProviders).filter(k => newProviders[k]).map(Number);
    onFilterChange({ with_watch_providers: selected.length > 0 ? selected.join('|') : null });
  };

  const handleCountryChange = (countryCode) => {
    onFilterChange({ watch_region: countryCode });
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
          {(selectedGenres.length + selectedProviders.length + (selectedCountry !== 'CO' ? 1 : 0)) > 0 &&
            `${selectedGenres.length + selectedProviders.length + (selectedCountry !== 'CO' ? 1 : 0)} filtros activos`}
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

          {/* País */}
          <div className="filter-section">
            <h3 className="filter-section__title">País</h3>
            <div className="filter-section__dropdown">
              <button
                className="filter-dropdown__toggle"
                onClick={() => setShowCountries(!showCountries)}
                aria-expanded={showCountries}
              >
                {COUNTRIES.find(c => c.code === selectedCountry)?.name || 'Colombia'}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <polyline points={showCountries ? '18 15 12 9 6 15' : '6 9 12 15 18 9'} />
                </svg>
              </button>
              {showCountries && (
                <div className="filter-dropdown__menu">
                  {COUNTRIES.map(country => (
                    <button
                      key={country.code}
                      className={`filter-dropdown__item${selectedCountry === country.code ? ' filter-dropdown__item--active' : ''}`}
                      onClick={() => handleCountryChange(country.code)}
                    >
                      {country.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Plataformas Streaming */}
          <div className="filter-section">
            <button
              className="filter-section__title filter-section__title--toggle"
              onClick={() => setShowProviders(!showProviders)}
              aria-expanded={showProviders}
            >
              Plataformas de streaming
              {selectedProviders.length > 0 && <span className="filter-badge">{selectedProviders.length}</span>}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <polyline points={showProviders ? '18 15 12 9 6 15' : '6 9 12 15 18 9'} />
              </svg>
            </button>
            {showProviders && (
              <div className="filter-section__providers">
                {STREAMING_PROVIDERS.map(provider => (
                  <label key={provider.id} className="filter-provider">
                    <input
                      type="checkbox"
                      checked={selectedProviders.includes(provider.id) || false}
                      onChange={() => handleProviderToggle(provider.id)}
                    />
                    <span className="filter-provider__label">{provider.name}</span>
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
