import { Link } from 'react-router-dom';
import { getPosterUrl } from '@/services/tmdb';
import './SeriesCard.css';

const POSTER_PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDMwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSI0NTAiIGZpbGw9IiMxNjE2MkEiLz48dGV4dCB4PSIxNTAiIHk9IjIzMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzYwNjA4MCIgZm9udC1zaXplPSIxNCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPlNpbiBlbWlzaW9uZXM8L3RleHQ+PC9zdmc+';

const SeriesCard = ({ series }) => {
  const {
    id, name, poster_path, vote_average, first_air_date,
  } = series;

  const posterUrl = getPosterUrl(poster_path, 'large') || POSTER_PLACEHOLDER;
  const year = first_air_date ? first_air_date.slice(0, 4) : '';

  const handlePosterError = (e) => {
    e.currentTarget.src = POSTER_PLACEHOLDER;
  };

  return (
    <Link to={`/serie/${id}`} className="series-card">
      <div className="series-card__image-wrapper">
        <img
          className="series-card__image"
          src={posterUrl}
          alt={`Póster de ${name}`}
          onError={handlePosterError}
        />
        <div className="series-card__overlay">
          <div className="series-card__actions">
            <button className="series-card__action-btn" aria-label="Reproducir" type="button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="series-card__info">
        <h3 className="series-card__title">{name}</h3>

        <div className="series-card__meta">
          {year && <span className="series-card__year">{year}</span>}
          {vote_average > 0 && (
            <span className="series-card__rating">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              {vote_average.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default SeriesCard;
