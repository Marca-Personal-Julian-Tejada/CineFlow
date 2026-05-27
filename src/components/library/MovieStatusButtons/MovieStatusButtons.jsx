import { useLibrary } from '@/context/LibraryContext';
import './MovieStatusButtons.css';

const MovieStatusButtons = ({ movie }) => {
  const { isWatched, isFavorite, isPending, toggleWatched, toggleFavorite, togglePending } = useLibrary();

  const watched = isWatched(movie.id);
  const favorite = isFavorite(movie.id);
  const pending = isPending(movie.id);

  return (
    <div className="status-buttons">
      <button
        className={`status-btn status-btn--watched${watched ? ' status-btn--active' : ''}`}
        onClick={() => toggleWatched(movie)}
        type="button"
        aria-pressed={watched}
        aria-label={watched ? 'Quitar de vistas' : 'Marcar como vista'}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill={watched ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <span>{watched ? 'Vista' : 'Marcar como vista'}</span>
      </button>

      <button
        className={`status-btn status-btn--favorite${favorite ? ' status-btn--active' : ''}`}
        onClick={() => toggleFavorite(movie)}
        type="button"
        aria-pressed={favorite}
        aria-label={favorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill={favorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        <span>{favorite ? 'Favorita' : 'Añadir a favoritos'}</span>
      </button>

      <button
        className={`status-btn status-btn--pending${pending ? ' status-btn--active' : ''}`}
        onClick={() => togglePending(movie)}
        type="button"
        aria-pressed={pending}
        aria-label={pending ? 'Quitar de pendientes' : 'Añadir a pendientes'}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <span>{pending ? 'En pendientes' : 'Añadir a pendientes'}</span>
      </button>
    </div>
  );
};

export default MovieStatusButtons;
