import { Link } from 'react-router-dom';
import { getBackdropUrl } from '@/services/tmdb';
import './HeroSection.css';

const HeroSection = ({ movie }) => {
  if (!movie) return null;

  const {
    id,
    title,
    overview,
    backdrop_path,
    release_date,
    vote_average,
    genre_ids,
  } = movie;

  const backdropUrl = getBackdropUrl(backdrop_path, 'large');
  const year = release_date ? release_date.slice(0, 4) : '';

  return (
    <section
      className="hero"
      style={backdropUrl ? { '--hero-bg': `url(${backdropUrl})` } : {}}
      aria-label={`Película destacada: ${title}`}
    >
      <div className="hero__backdrop" aria-hidden="true" />
      <div className="hero__gradient" aria-hidden="true" />
      <div className="container hero__content">
        <div className="hero__badge">Destacada</div>
        <h1 className="hero__title">{title}</h1>
        <div className="hero__meta">
          {year && <span className="hero__year">{year}</span>}
          {vote_average > 0 && (
            <span className="hero__rating">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              {vote_average.toFixed(1)}
            </span>
          )}
        </div>
        {overview && (
          <p className="hero__overview">{overview}</p>
        )}
        <div className="hero__actions">
          <Link to={`/pelicula/${id}`} className="hero__btn hero__btn--primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 8 16 12 12 16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            Más información
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
