import { useParams, Link } from 'react-router-dom';
import useFetch from '@/hooks/useFetch';
import { getTVDetail, getPosterUrl, getBackdropUrl } from '@/services/tmdb';
import MovieStatusButtons from '@/components/library/MovieStatusButtons/MovieStatusButtons';
import CastCard from '@/components/movie/CastCard/CastCard';
import Skeleton from '@/components/ui/Skeleton/Skeleton';
import ErrorMessage from '@/components/ui/ErrorMessage/ErrorMessage';
import '../MovieDetail/MovieDetail.css';

const POSTER_PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDMwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSI0NTAiIGZpbGw9IiMxNjE2MkEiLz48dGV4dCB4PSIxNTAiIHk9IjIzMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzYwNjA4MCIgZm9udC1zaXplPSIxNCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPlNpbiBlbWlzaW9uZXM8L3RleHQ+PC9zdmc+';

const LANGUAGE_NAMES = {
  en: 'Inglés', es: 'Español', fr: 'Francés', de: 'Alemán', it: 'Italiano',
  pt: 'Portugués', ja: 'Japonés', ko: 'Coreano', zh: 'Chino', ru: 'Ruso',
};

const COUNTRY_NAMES = {
  US: 'Estados Unidos', GB: 'Reino Unido', FR: 'Francia', DE: 'Alemania',
  IT: 'Italia', ES: 'España', JP: 'Japón', KR: 'Corea del Sur', CN: 'China',
};

const IconCalendar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
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

const SeriesMetadata = ({ firstAirDate, originalName, originalLanguage, networks, homepage, name }) => {
  const hasData = firstAirDate || originalName || originalLanguage || networks?.length || homepage;
  if (!hasData) return null;

  const langName = LANGUAGE_NAMES[originalLanguage] || originalLanguage?.toUpperCase();
  const networkNames = networks?.map(n => n.name).join(', ');

  return (
    <div className="movie-meta">
      <h2 className="detail-page__section-title">Información de la serie</h2>
      <dl className="movie-meta__grid">
        {firstAirDate && (
          <MetaField icon={<IconCalendar />} label="Estreno">
            {new Date(firstAirDate).toLocaleDateString('es-ES')}
          </MetaField>
        )}
        {langName && (
          <MetaField icon={<IconCalendar />} label="Idioma original">
            {langName}
          </MetaField>
        )}
        {networkNames && (
          <MetaField icon={<IconCalendar />} label="Canales">
            {networkNames}
          </MetaField>
        )}
        {homepage && (
          <MetaField icon={<IconCalendar />} label="Sitio oficial">
            <a
              href={homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="movie-meta__link"
              aria-label={`Sitio oficial de ${name} (abre en nueva pestaña)`}
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

const SeriesDetail = () => {
  const { id } = useParams();
  const { data: series, isLoading, error, refetch } = useFetch(
    (signal) => getTVDetail(id, signal),
    [id]
  );

  if (isLoading) return <div className="detail-page"><Skeleton variant="detail" /></div>;
  if (error) return (
    <div className="detail-page container">
      <ErrorMessage message="No se pudo cargar la información de esta serie." onRetry={refetch} />
    </div>
  );
  if (!series) return null;

  const {
    name, overview, poster_path, backdrop_path,
    first_air_date, vote_average, genres = [],
    credits, videos, tagline,
    original_name, original_language, networks = [], homepage,
  } = series;

  const posterUrl = getPosterUrl(poster_path, 'large') || POSTER_PLACEHOLDER;
  const backdropUrl = getBackdropUrl(backdrop_path, 'large');
  const cast = credits?.cast?.slice(0, 10) || [];

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
          <Link to="/series" className="breadcrumb__link">Series</Link>
          <span className="breadcrumb__sep" aria-hidden="true">/</span>
          <span className="breadcrumb__current" aria-current="page">{name}</span>
        </nav>

        <div className="detail-page__main">
          <aside className="detail-page__poster-col">
            <img
              className="detail-page__poster"
              src={posterUrl}
              alt={`Póster de ${name}`}
              onError={handlePosterError}
            />
          </aside>

          <div className="detail-page__info">
            <h1 className="detail-page__title">{name}</h1>

            {tagline && (
              <p className="detail-page__tagline">"{tagline}"</p>
            )}

            <div className="detail-page__meta">
              {first_air_date && (
                <span className="detail-page__meta-item">
                  {first_air_date.slice(0, 4)}
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
                    to={`/series?genero=${g.id}`}
                    className="detail-page__genre-tag"
                    aria-label={`Ver series de ${g.name}`}
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

            <SeriesMetadata
              firstAirDate={first_air_date}
              originalName={original_name}
              originalLanguage={original_language}
              networks={networks}
              homepage={homepage}
              name={name}
            />

            <MovieStatusButtons movie={series} />
          </div>
        </div>

        {trailer && (
          <section className="detail-page__trailer">
            <h2 className="detail-page__section-title">Tráiler oficial</h2>
            <div className="trailer-player">
              <iframe
                className="trailer-player__frame"
                src={`https://www.youtube.com/embed/${trailer.key}?rel=0&modestbranding=1`}
                title={trailer.name || `Tráiler de ${name}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </section>
        )}

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

export default SeriesDetail;
