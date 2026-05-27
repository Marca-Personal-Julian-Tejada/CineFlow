import { Link } from 'react-router-dom';
import { getPosterUrl } from '@/services/tmdb';
import { useLibrary } from '@/context/LibraryContext';
import './MovieCard.css';

const PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDMwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSI0NTAiIGZpbGw9IiMxNjE2MkEiLz48cGF0aCBkPSJNMTIwIDE3NUgxODBWMjI1SDE0MFYyNzVIMTIwVjE3NVpNMTYwIDE3NUgxODBWMjc1SDE2MFYxNzVaIiBmaWxsPSIjMkEyQTQ0Ii8+PHRleHQgeD0iMTUwIiB5PSIzMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2MDYwODAiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj5TaW4gaW1hZ2VuPC90ZXh0Pjwvc3ZnPg==';

const StarRating = ({ rating }) => {
  const stars = Math.round(rating / 2);
  return (
    <div className="movie-card__stars" aria-label={`Calificación: ${rating.toFixed(1)} de 10`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className={`star${i < stars ? ' star--filled' : ''}`}
          width="12" height="12" viewBox="0 0 24 24"
          fill={i < stars ? 'currentColor' : 'none'}
          stroke="currentColor" strokeWidth="2" aria-hidden="true"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
      <span className="movie-card__rating-value">{rating.toFixed(1)}</span>
    </div>
  );
};

/* Icono check (Vista) */
const IconCheck = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/* Icono corazón (Favorita) */
const IconHeart = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

/* Icono reloj (Pendiente) */
const IconClock = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const StatusBadges = ({ movieId }) => {
  const { isWatched, isFavorite, isPending } = useLibrary();
  const watched = isWatched(movieId);
  const favorite = isFavorite(movieId);
  const pending = isPending(movieId);

  if (!watched && !favorite && !pending) return null;

  return (
    <div className="movie-card__badges" aria-label="Estado en tu biblioteca">
      {watched && (
        <span className="movie-card__badge movie-card__badge--watched" title="Vista">
          <IconCheck /> Vista
        </span>
      )}
      {favorite && (
        <span className="movie-card__badge movie-card__badge--favorite" title="Favorita">
          <IconHeart /> Favorita
        </span>
      )}
      {pending && (
        <span className="movie-card__badge movie-card__badge--pending" title="Pendiente">
          <IconClock /> Pendiente
        </span>
      )}
    </div>
  );
};

const MovieCard = ({ movie }) => {
  const { id, title, poster_path, release_date, vote_average } = movie;
  const year = release_date ? release_date.slice(0, 4) : 'N/A';
  const posterUrl = getPosterUrl(poster_path) || PLACEHOLDER;

  const handleImgError = (e) => { e.currentTarget.src = PLACEHOLDER; };

  return (
    <article className="movie-card">
      <Link to={`/pelicula/${id}`} className="movie-card__link" aria-label={`Ver detalles de ${title}`}>
        <div className="movie-card__poster-wrapper">
          <img
            className="movie-card__poster"
            src={posterUrl}
            alt={`Poster de ${title}`}
            loading="lazy"
            onError={handleImgError}
          />
          {/* Badges de estado sobreimpresos en el poster */}
          <StatusBadges movieId={id} />
          <div className="movie-card__overlay">
            <span className="movie-card__overlay-text">Ver detalles</span>
          </div>
        </div>
        <div className="movie-card__info">
          <h3 className="movie-card__title">{title}</h3>
          <div className="movie-card__meta">
            <span className="movie-card__year">{year}</span>
            {vote_average > 0 && <StarRating rating={vote_average} />}
          </div>
        </div>
      </Link>
    </article>
  );
};

export default MovieCard;
