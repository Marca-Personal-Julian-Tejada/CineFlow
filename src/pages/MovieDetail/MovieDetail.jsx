import { useParams, Link } from 'react-router-dom';
import useFetch from '@/hooks/useFetch';
import { getMovieDetail, getPosterUrl, getBackdropUrl } from '@/services/tmdb';
import MovieStatusButtons from '@/components/library/MovieStatusButtons/MovieStatusButtons';
import CastCard from '@/components/movie/CastCard/CastCard';
import Skeleton from '@/components/ui/Skeleton/Skeleton';
import ErrorMessage from '@/components/ui/ErrorMessage/ErrorMessage';
import './MovieDetail.css';

const POSTER_PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDMwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSI0NTAiIGZpbGw9IiMxNjE2MkEiLz48dGV4dCB4PSIxNTAiIHk9IjIzMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzYwNjA4MCIgZm9udC1zaXplPSIxNCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPlNpbiBpbWFnZW48L3RleHQ+PC9zdmc+';

const formatRuntime = (minutes) => {
  if (!minutes) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split('-');
  const months = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  return `${Number(d)} ${months[Number(m) - 1]}. ${y}`;
};

const LANGUAGE_NAMES = {
  en: 'Inglés', es: 'Español', fr: 'Francés', de: 'Alemán', it: 'Italiano',
  pt: 'Portugués', ja: 'Japonés', ko: 'Coreano', zh: 'Chino', ru: 'Ruso',
  ar: 'Árabe', hi: 'Hindi', tr: 'Turco', nl: 'Neerlandés', sv: 'Sueco',
  pl: 'Polaco', da: 'Danés', fi: 'Finlandés', no: 'Noruego', th: 'Tailandés',
};

const COUNTRY_NAMES = {
  US: 'Estados Unidos', GB: 'Reino Unido', FR: 'Francia', DE: 'Alemania',
  IT: 'Italia', ES: 'España', JP: 'Japón', KR: 'Corea del Sur', CN: 'China',
  IN: 'India', AU: 'Australia', CA: 'Canadá', MX: 'México', BR: 'Brasil',
  AR: 'Argentina', CO: 'Colombia', RU: 'Rusia', TR: 'Turquía', NL: 'Países Bajos',
};

/* Íconos para cada campo de metadato */
const IconCalendar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const IconFilm = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
    <line x1="7" y1="2" x2="7" y2="22" /><line x1="17" y1="2" x2="17" y2="22" />
    <line x1="2" y1="12" x2="22" y2="12" /><line x1="2" y1="7" x2="7" y2="7" />
    <line x1="2" y1="17" x2="7" y2="17" /><line x1="17" y1="17" x2="22" y2="17" />
    <line x1="17" y1="7" x2="22" y2="7" />
  </svg>
);
const IconGlobe = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);
const IconMap = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
    <line x1="8" y1="2" x2="8" y2="18" />
    <line x1="16" y1="6" x2="16" y2="22" />
  </svg>
);
const IconLink = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);
const IconExternalLink = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const MetaField = ({ icon, label, children }) => (
  <div className="movie-meta__field">
    <dt className="movie-meta__label">
      {icon}
      {label}
    </dt>
    <dd className="movie-meta__value">{children}</dd>
  </div>
);

const MovieMetadata = ({ releaseDate, originalTitle, originalLanguage, originCountry, homepage, title }) => {
  const hasData = releaseDate || originalTitle || originalLanguage || originCountry?.length || homepage;
  if (!hasData) return null;

  const langName = LANGUAGE_NAMES[originalLanguage] || originalLanguage?.toUpperCase();
  const countryName = originCountry?.map((c) => COUNTRY_NAMES[c] || c).join(', ');
  const showOriginalTitle = originalTitle && originalTitle !== title;

  return (
    <div className="movie-meta">
      <h2 className="detail-page__section-title">Ficha técnica</h2>
      <dl className="movie-meta__grid">
        {releaseDate && (
          <MetaField icon={<IconCalendar />} label="Estreno">
            {formatDate(releaseDate)}
          </MetaField>
        )}
        {showOriginalTitle && (
          <MetaField icon={<IconFilm />} label="Título original">
            <span className="movie-meta__original-title">{originalTitle}</span>
          </MetaField>
        )}
        {langName && (
          <MetaField icon={<IconGlobe />} label="Idioma original">
            {langName}
          </MetaField>
        )}
        {countryName && (
          <MetaField icon={<IconMap />} label="País de origen">
            {countryName}
          </MetaField>
        )}
        {homepage && (
          <MetaField icon={<IconLink />} label="Sitio oficial">
            <a
              href={homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="movie-meta__link"
              aria-label={`Sitio oficial de ${title} (abre en nueva pestaña)`}
            >
              Visitar sitio
              <IconExternalLink />
            </a>
          </MetaField>
        )}
      </dl>
    </div>
  );
};

const MovieDetail = () => {
  const { id } = useParams();
  const { data: movie, isLoading, error, refetch } = useFetch(
    (signal) => getMovieDetail(id, signal),
    [id]
  );

  if (isLoading) return <div className="detail-page"><Skeleton variant="detail" /></div>;
  if (error) return (
    <div className="detail-page container">
      <ErrorMessage message="No se pudo cargar la información de esta película." onRetry={refetch} />
    </div>
  );
  if (!movie) return null;

  const {
    title, overview, poster_path, backdrop_path,
    release_date, vote_average, runtime, genres = [],
    credits, videos, tagline,
    original_title, original_language, origin_country = [], homepage,
  } = movie;

  const year = release_date ? release_date.slice(0, 4) : '';
  const posterUrl = getPosterUrl(poster_path, 'large') || POSTER_PLACEHOLDER;
  const backdropUrl = getBackdropUrl(backdrop_path, 'large');
  const cast = credits?.cast?.slice(0, 10) || [];

  /* Selecciona el mejor trailer: primero en español, luego en inglés, luego cualquiera */
  const trailer = (() => {
    const all = (videos?.results || []).filter(v => v.site === 'YouTube' && v.type === 'Trailer');
    return all.find(v => v.iso_639_1 === 'es')
      || all.find(v => v.iso_639_1 === 'en')
      || all[0]
      || null;
  })();

  const handlePosterError = (e) => { e.currentTarget.src = POSTER_PLACEHOLDER; };

  return (
    <article className="detail-page">
      {/* Backdrop */}
      {backdropUrl && (
        <div
          className="detail-page__backdrop"
          style={{ '--backdrop-img': `url(${backdropUrl})` }}
          aria-hidden="true"
        >
          <div className="detail-page__backdrop-overlay" />
        </div>
      )}

      <div className="detail-page__content container">
        <nav className="detail-page__breadcrumb" aria-label="Migas de pan">
          <Link to="/" className="breadcrumb__link">Películas</Link>
          <span className="breadcrumb__sep" aria-hidden="true">/</span>
          <span className="breadcrumb__current" aria-current="page">{title}</span>
        </nav>

        <div className="detail-page__main">
          {/* Poster */}
          <aside className="detail-page__poster-col">
            <img
              className="detail-page__poster"
              src={posterUrl}
              alt={`Poster de ${title}`}
              onError={handlePosterError}
            />
          </aside>

          {/* Info */}
          <div className="detail-page__info">
            <h1 className="detail-page__title">{title}</h1>

            {tagline && (
              <p className="detail-page__tagline">"{tagline}"</p>
            )}

            <div className="detail-page__meta">
              {year && <span className="detail-page__meta-item">{year}</span>}
              {runtime > 0 && (
                <span className="detail-page__meta-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  {formatRuntime(runtime)}
                </span>
              )}
              {vote_average > 0 && (
                <span className="detail-page__meta-item detail-page__meta-item--rating">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  {vote_average.toFixed(1)}/10
                </span>
              )}
            </div>

            {genres.length > 0 && (
              <div className="detail-page__genres">
                {genres.map((g) => (
                  <Link
                    key={g.id}
                    to={`/buscar?genero=${g.id}`}
                    className="detail-page__genre-tag"
                    aria-label={`Ver películas de ${g.name}`}
                  >
                    {g.name}
                  </Link>
                ))}
              </div>
            )}

            {overview && (
              <div className="detail-page__overview">
                <h2 className="detail-page__section-title">Sinopsis</h2>
                <p className="detail-page__overview-text">{overview}</p>
              </div>
            )}

            <MovieMetadata
              releaseDate={release_date}
              originalTitle={original_title}
              originalLanguage={original_language}
              originCountry={origin_country}
              homepage={homepage}
              title={title}
            />

            <MovieStatusButtons movie={movie} />
          </div>
        </div>

        {/* Trailer */}
        {trailer && (
          <section className="detail-page__trailer">
            <h2 className="detail-page__section-title">Tráiler oficial</h2>
            <div className="trailer-player">
              <iframe
                className="trailer-player__frame"
                src={`https://www.youtube.com/embed/${trailer.key}?rel=0&modestbranding=1`}
                title={trailer.name || `Tráiler de ${title}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </section>
        )}

        {/* Reparto */}
        {cast.length > 0 && (
          <section className="detail-page__cast">
            <h2 className="detail-page__section-title">Reparto principal</h2>
            <div className="detail-page__cast-grid">
              {cast.map((member) => (
                <CastCard key={member.cast_id || member.id} member={member} />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
};

export default MovieDetail;
