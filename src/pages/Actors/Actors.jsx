import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useFetch from '@/hooks/useFetch';
import useDebounce from '@/hooks/useDebounce';
import { getPopularPeople, searchPeople, getPosterUrl } from '@/services/tmdb';
import ErrorMessage from '@/components/ui/ErrorMessage/ErrorMessage';
import Pagination from '@/components/ui/Pagination/Pagination';
import './Actors.css';

const AVATAR_PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDMwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSI0NTAiIGZpbGw9IiMxNjE2MkEiLz48Y2lyY2xlIGN4PSIxNTAiIGN5PSIxNjAiIHI9IjYwIiBmaWxsPSIjMkEyQTQ0Ii8+PHBhdGggZD0iTTMwIDQyMGE0MCAxMjAgMCAwIDEgMjQwIDAiIGZpbGw9IiMyQTJBNDQiLz48L3N2Zz4=';

/* Skeleton de tarjeta actor */
const ActorCardSkeleton = () => (
  <div className="actor-card actor-card--skeleton" aria-hidden="true">
    <div className="actor-card__photo-wrapper">
      <div className="skeleton" style={{ width: '100%', height: '100%' }} />
    </div>
    <div className="actor-card__info">
      <div className="skeleton skeleton--text" style={{ width: '70%', height: '1.4rem', marginBottom: '0.6rem' }} />
      <div className="skeleton skeleton--text" style={{ width: '50%', height: '1.2rem' }} />
    </div>
  </div>
);

const ActorCard = ({ person }) => {
  const navigate = useNavigate();
  const photoUrl = person.profile_path
    ? getPosterUrl(person.profile_path, 'medium')
    : AVATAR_PLACEHOLDER;

  const knownFor = person.known_for?.filter(m => m.media_type === 'movie').slice(0, 2)
    .map(m => m.title).join(', ');

  return (
    <article
      className="actor-card"
      onClick={() => navigate(`/actor/${person.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(`/actor/${person.id}`); } }}
      aria-label={`Ver perfil de ${person.name}`}
    >
      <div className="actor-card__photo-wrapper">
        <img
          className="actor-card__photo"
          src={photoUrl}
          alt={person.name}
          loading="lazy"
          onError={(e) => { e.currentTarget.src = AVATAR_PLACEHOLDER; }}
        />
        <div className="actor-card__overlay" aria-hidden="true">
          <svg className="actor-card__overlay-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span className="actor-card__overlay-text">Ver perfil</span>
        </div>
      </div>
      <div className="actor-card__info">
        <p className="actor-card__name">{person.name}</p>
        {knownFor && <p className="actor-card__known-for">{knownFor}</p>}
      </div>
    </article>
  );
};

/* Barra de búsqueda de actores */
const ActorSearchBar = ({ onSearch }) => {
  const [value, setValue] = useState('');
  const debouncedValue = useDebounce(value, 500);
  const inputRef = useRef(null);

  useEffect(() => {
    onSearch(debouncedValue.trim());
  }, [debouncedValue]); // eslint-disable-line

  const handleClear = () => {
    setValue('');
    inputRef.current?.focus();
  };

  return (
    <div className="actors-search">
      <div className="actors-search__bar">
        <svg className="actors-search__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          ref={inputRef}
          type="search"
          className="actors-search__input"
          placeholder="Buscar actores, directores…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-label="Buscar actores"
        />
        {value && (
          <button className="actors-search__clear" onClick={handleClear} type="button" aria-label="Limpiar búsqueda">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
      <div className="actors-search__chips" aria-label="Búsquedas sugeridas">
        {['Tom Hanks', 'Meryl Streep', 'Leonardo DiCaprio', 'Scarlett Johansson'].map((s) => (
          <button key={s} className="actors-search__chip" onClick={() => { setValue(s); }} type="button">
            {s}
          </button>
        ))}
      </div>
    </div>
  );
};

/* Sección paginada de actores populares */
const PopularActors = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, error, refetch } = useFetch(
    useCallback((signal) => getPopularPeople(page, signal), [page]),
    [page]
  );

  const people = data?.results || [];
  const totalPages = data?.total_pages ? Math.min(data.total_pages, 500) : 0;

  if (error) return <ErrorMessage message="No se pudieron cargar los actores." onRetry={refetch} />;

  return (
    <>
      <div className="actors-grid">
        {isLoading
          ? Array.from({ length: 20 }, (_, i) => <ActorCardSkeleton key={i} />)
          : people.map((p) => <ActorCard key={p.id} person={p} />)
        }
      </div>
      {!isLoading && totalPages > 1 && (
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
      )}
    </>
  );
};

/* Resultados de búsqueda */
const SearchResults = ({ query }) => {
  const [page, setPage] = useState(1);

  useEffect(() => { setPage(1); }, [query]);

  const { data, isLoading, error, refetch } = useFetch(
    useCallback((signal) => searchPeople({ query, page }, signal), [query, page]),
    [query, page]
  );

  const people = data?.results || [];
  const totalPages = data?.total_pages ? Math.min(data.total_pages, 500) : 0;

  if (error) return <ErrorMessage message="Error al buscar actores." onRetry={refetch} />;

  if (!isLoading && people.length === 0) {
    return (
      <div className="actors-empty">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
        </svg>
        <p>No encontramos resultados para <strong>"{query}"</strong></p>
      </div>
    );
  }

  return (
    <>
      <p className="actors-results__count">
        {isLoading ? 'Buscando…' : `${data?.total_results?.toLocaleString('es-CO') || 0} resultados para "${query}"`}
      </p>
      <div className="actors-grid">
        {isLoading
          ? Array.from({ length: 12 }, (_, i) => <ActorCardSkeleton key={i} />)
          : people.map((p) => <ActorCard key={p.id} person={p} />)
        }
      </div>
      {!isLoading && totalPages > 1 && (
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
      )}
    </>
  );
};

const Actors = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="actors-page">
      {/* Hero */}
      <div className="actors-hero">
        <div className="actors-hero__particles" aria-hidden="true" />
        <div className="actors-hero__overlay" aria-hidden="true" />
        <div className="container actors-hero__content">
          <div className="actors-hero__badge">Directorio de talento</div>
          <h1 className="actors-hero__title">El elenco del cine</h1>
          <p className="actors-hero__subtitle">Explora actores, directores y estrellas del séptimo arte</p>
          <ActorSearchBar onSearch={setSearchQuery} />
        </div>
      </div>

      {/* Cuerpo */}
      <div className="container actors-page__body">
        {searchQuery
          ? <SearchResults key={searchQuery} query={searchQuery} />
          : (
            <>
              <h2 className="actors-section-title">
                <span className="actors-section-title__bar" aria-hidden="true" />
                Más populares ahora
              </h2>
              <PopularActors />
            </>
          )
        }
      </div>
    </div>
  );
};

export default Actors;
