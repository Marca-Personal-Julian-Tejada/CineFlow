import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useFetch from '@/hooks/useFetch';
import { getGenres, discoverMovies, getBackdropUrl } from '@/services/tmdb';
import ErrorMessage from '@/components/ui/ErrorMessage/ErrorMessage';
import Skeleton from '@/components/ui/Skeleton/Skeleton';
import './Genres.css';

/* Íconos SVG por género — se asocian por nombre */
const GENRE_ICONS = {
  'Acción':           'M13 10V3L4 14h7v7l9-11h-7z',
  'Aventura':         'M3 12l9-9 9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9',
  'Animación':        'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z',
  'Comedia':          'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  'Crimen':           'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
  'Documental':       'M15 10l4.553-2.069A1 1 0 0121 8.87V15.13a1 1 0 01-1.447.9L15 14M3 8h12a2 2 0 012 2v4a2 2 0 01-2 2H3a2 2 0 01-2-2v-4a2 2 0 012-2z',
  'Drama':            'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3',
  'Familia':          'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z',
  'Fantasía':         'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
  'Historia':         'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  'Terror':           'M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z',
  'Música':           'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z',
  'Misterio':         'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
  'Romance':          'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
  'Ciencia ficción':  'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2',
  'Película de TV':   'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2',
  'Suspense':         'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
  'Bélica':           'M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9',
  'Western':          'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
};

const DEFAULT_ICON = 'M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z';

const ACCENT_COLORS = [
  '#E11D48', '#CA8A04', '#7C3AED', '#0891B2', '#16A34A',
  '#D97706', '#BE185D', '#2563EB', '#059669', '#9333EA',
  '#DC2626', '#B45309', '#6D28D9', '#0284C7', '#15803D',
  '#F59E0B', '#DB2777', '#1D4ED8', '#047857', '#E11D48',
];

/* Carga el backdrop de la primera película del género */
const useGenreBackdrop = (genreId) => {
  const [backdropUrl, setBackdropUrl] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    discoverMovies({ genreId, page: 1 }, controller.signal)
      .then((data) => {
        if (cancelled) return;
        const movie = data?.results?.find((m) => m.backdrop_path);
        if (movie) setBackdropUrl(getBackdropUrl(movie.backdrop_path, 'medium'));
      })
      .catch(() => {});

    return () => { cancelled = true; controller.abort(); };
  }, [genreId]);

  return backdropUrl;
};

const GenreCard = ({ genre, index, onClick }) => {
  const backdropUrl = useGenreBackdrop(genre.id);
  const color = ACCENT_COLORS[index % ACCENT_COLORS.length];
  const iconPath = GENRE_ICONS[genre.name] || DEFAULT_ICON;

  return (
    <button
      className="genre-card"
      onClick={() => onClick(genre.id)}
      type="button"
      style={{ '--genre-color': color }}
      aria-label={`Ver películas de ${genre.name}`}
    >
      {/* Backdrop real de TMDB */}
      {backdropUrl && (
        <img
          className="genre-card__backdrop"
          src={backdropUrl}
          alt=""
          aria-hidden="true"
          loading="lazy"
        />
      )}

      {/* Overlay degradado con el color del género */}
      <div className="genre-card__overlay" aria-hidden="true" />

      {/* Contenido */}
      <div className="genre-card__content">
        <div className="genre-card__icon-wrap" aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d={iconPath} />
          </svg>
        </div>
        <span className="genre-card__name">{genre.name}</span>
      </div>

      {/* Flecha hover */}
      <svg className="genre-card__arrow" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>
  );
};

const GenreSkeleton = () => (
  <div className="genre-card genre-card--skeleton" aria-hidden="true">
    <div className="skeleton" style={{ position: 'absolute', inset: 0, borderRadius: 'var(--radius-xl)' }} />
  </div>
);

const Genres = () => {
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useFetch(
    (signal) => getGenres(signal),
    []
  );

  const genres = data?.genres || [];

  const handleGenreClick = (genreId) => {
    navigate(`/buscar?genero=${genreId}`);
  };

  return (
    <div className="genres-page">
      {/* Hero de géneros */}
      <div className="genres-hero">
        <div className="genres-hero__overlay" aria-hidden="true" />
        <div className="container genres-hero__content">
          <h1 className="genres-hero__title">Explorar por género</h1>
          <p className="genres-hero__subtitle">Elige el universo cinematográfico que quieres descubrir hoy</p>
        </div>
      </div>

      <div className="container genres-page__body">
        {error ? (
          <ErrorMessage message="No se pudieron cargar los géneros." onRetry={refetch} />
        ) : (
          <div className="genres-grid">
            {isLoading
              ? Array.from({ length: 12 }, (_, i) => <GenreSkeleton key={i} />)
              : genres.map((genre, index) => (
                  <GenreCard
                    key={genre.id}
                    genre={genre}
                    index={index}
                    onClick={handleGenreClick}
                  />
                ))
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default Genres;
