import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getBackdropUrl } from '@/services/tmdb';
import './HeroCarousel.css';

const SLIDE_DURATION = 6000;

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const ChevronIcon = ({ direction }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    {direction === 'left'
      ? <polyline points="15 18 9 12 15 6" />
      : <polyline points="9 18 15 12 9 6" />}
  </svg>
);

const HeroSlide = ({ movie, isActive, isPrev }) => {
  const backdropUrl = getBackdropUrl(movie.backdrop_path, 'large');
  const year = movie.release_date ? movie.release_date.slice(0, 4) : '';

  return (
    <div
      className={`hero-slide${isActive ? ' hero-slide--active' : ''}${isPrev ? ' hero-slide--prev' : ''}`}
      aria-hidden={!isActive}
    >
      {/* Backdrop */}
      {backdropUrl && (
        <div
          className="hero-slide__backdrop"
          style={{ backgroundImage: `url(${backdropUrl})` }}
        />
      )}
      <div className="hero-slide__gradient" />

      {/* Content */}
      <div className="container hero-slide__content">
        <div className="hero-slide__badge">En cartelera</div>
        <h1 className="hero-slide__title">{movie.title}</h1>
        <div className="hero-slide__meta">
          {year && <span className="hero-slide__year">{year}</span>}
          {movie.vote_average > 0 && (
            <span className="hero-slide__rating">
              <StarIcon />
              {movie.vote_average.toFixed(1)}
            </span>
          )}
        </div>
        {movie.overview && (
          <p className="hero-slide__overview">{movie.overview}</p>
        )}
        <div className="hero-slide__actions">
          <Link
            to={`/pelicula/${movie.id}`}
            className="hero-slide__btn"
            tabIndex={isActive ? 0 : -1}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 8 16 12 12 16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            Más información
          </Link>
        </div>
      </div>
    </div>
  );
};

const HeroCarousel = ({ movies = [] }) => {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(null);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);
  const reducedMotion = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  const validMovies = movies.filter((m) => m.backdrop_path).slice(0, 8);

  const goTo = useCallback((index) => {
    setCurrent((c) => {
      setPrev(c);
      return index;
    });
  }, []);

  const next = useCallback(() => {
    goTo((current + 1) % validMovies.length);
  }, [current, validMovies.length, goTo]);

  const prev_ = useCallback(() => {
    goTo((current - 1 + validMovies.length) % validMovies.length);
  }, [current, validMovies.length, goTo]);

  /* Auto-advance */
  useEffect(() => {
    if (reducedMotion.current || paused || validMovies.length <= 1) return;
    timerRef.current = setTimeout(next, SLIDE_DURATION);
    return () => clearTimeout(timerRef.current);
  }, [current, paused, next, validMovies.length]);

  /* Clear prev slide class after transition */
  useEffect(() => {
    if (prev === null) return;
    const t = setTimeout(() => setPrev(null), 900);
    return () => clearTimeout(t);
  }, [prev]);

  /* Keyboard navigation */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev_();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev_]);

  if (!validMovies.length) return null;

  return (
    <section
      className="hero-carousel"
      aria-label="Películas en cartelera"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* Slides */}
      <div className="hero-carousel__track" aria-live="polite" aria-atomic="true">
        {validMovies.map((movie, i) => (
          <HeroSlide
            key={movie.id}
            movie={movie}
            isActive={i === current}
            isPrev={i === prev}
          />
        ))}
      </div>

      {/* Progress bar */}
      {!reducedMotion.current && (
        <div className="hero-carousel__progress" aria-hidden="true">
          <div
            key={current}
            className={`hero-carousel__progress-bar${paused ? ' hero-carousel__progress-bar--paused' : ''}`}
            style={{ animationDuration: `${SLIDE_DURATION}ms` }}
          />
        </div>
      )}

      {/* Prev / Next arrows */}
      {validMovies.length > 1 && (
        <>
          <button
            className="hero-carousel__arrow hero-carousel__arrow--prev"
            onClick={prev_}
            aria-label="Película anterior"
            type="button"
          >
            <ChevronIcon direction="left" />
          </button>
          <button
            className="hero-carousel__arrow hero-carousel__arrow--next"
            onClick={next}
            aria-label="Película siguiente"
            type="button"
          >
            <ChevronIcon direction="right" />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {validMovies.length > 1 && (
        <div className="hero-carousel__dots" role="tablist" aria-label="Seleccionar película">
          {validMovies.map((movie, i) => (
            <button
              key={movie.id}
              role="tab"
              aria-selected={i === current}
              aria-label={`${movie.title} (${i + 1} de ${validMovies.length})`}
              className={`hero-carousel__dot${i === current ? ' hero-carousel__dot--active' : ''}`}
              onClick={() => goTo(i)}
              type="button"
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default HeroCarousel;
