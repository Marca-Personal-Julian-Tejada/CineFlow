import { Link } from 'react-router-dom';
import { getBackdropUrl, getPosterUrl } from '@/services/tmdb';
import './SeriesHeroSection.css';

const SeriesHeroSection = ({ series }) => {
  if (!series) return null;

  const {
    id, name, overview, backdrop_path, poster_path, vote_average, first_air_date,
  } = series;

  const backdropUrl = getBackdropUrl(backdrop_path, 'large');
  const year = first_air_date ? first_air_date.slice(0, 4) : '';

  return (
    <section className="series-hero">
      {backdropUrl && (
        <div
          className="series-hero__backdrop"
          style={{ backgroundImage: `url(${backdropUrl})` }}
          aria-hidden="true"
        >
          <div className="series-hero__overlay" />
        </div>
      )}

      <div className="series-hero__content container">
        <div className="series-hero__text">
          <h1 className="series-hero__title">{name}</h1>
          {year && <span className="series-hero__year">{year}</span>}
          {vote_average > 0 && (
            <div className="series-hero__rating">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span>{vote_average.toFixed(1)}/10</span>
            </div>
          )}
          {overview && (
            <p className="series-hero__overview">{overview}</p>
          )}
          <Link to={`/serie/${id}`} className="series-hero__cta">
            Ver detalles
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SeriesHeroSection;
