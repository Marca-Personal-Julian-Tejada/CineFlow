import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import useFetch from '@/hooks/useFetch';
import { getPersonDetail, getPosterUrl } from '@/services/tmdb';
import Skeleton from '@/components/ui/Skeleton/Skeleton';
import ErrorMessage from '@/components/ui/ErrorMessage/ErrorMessage';
import './ActorDetail.css';

const AVATAR_PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDMwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSI0NTAiIGZpbGw9IiMxNjE2MkEiLz48Y2lyY2xlIGN4PSIxNTAiIGN5PSIxNjAiIHI9IjYwIiBmaWxsPSIjMkEyQTQ0Ii8+PHBhdGggZD0iTTMwIDQyMGE0MCAxMjAgMCAwIDEgMjQwIDAiIGZpbGw9IiMyQTJBNDQiLz48L3N2Zz4=';
const POSTER_PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDMwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSI0NTAiIGZpbGw9IiMxNjE2MkEiLz48dGV4dCB4PSIxNTAiIHk9IjIzMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzYwNjA4MCIgZm9udC1zaXplPSIxNCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPlNpbiBpbWFnZW48L3RleHQ+PC9zdmc+';

const GENDER_LABEL = { 1: 'Femenino', 2: 'Masculino', 3: 'No binario' };
const MONTH_NAMES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];

const formatDate = (dateStr) => {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split('-');
  return `${Number(d)} de ${MONTH_NAMES[Number(m) - 1]} de ${y}`;
};

const calcAge = (birthday, deathday) => {
  if (!birthday) return null;
  const end = deathday ? new Date(deathday) : new Date();
  const birth = new Date(birthday);
  let age = end.getFullYear() - birth.getFullYear();
  const m = end.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && end.getDate() < birth.getDate())) age--;
  return age;
};

/* Tarjeta de película en la filmografía */
const FilmographyCard = ({ movie }) => {
  const posterUrl = movie.poster_path ? getPosterUrl(movie.poster_path, 'small') : POSTER_PLACEHOLDER;
  const year = movie.release_date ? movie.release_date.slice(0, 4) : '';

  return (
    <Link
      to={`/pelicula/${movie.id}`}
      className="filmography-card"
      aria-label={`Ver ${movie.title}${year ? ` (${year})` : ''}`}
    >
      <div className="filmography-card__poster-wrap">
        <img
          className="filmography-card__poster"
          src={posterUrl}
          alt={`Poster de ${movie.title}`}
          loading="lazy"
          onError={(e) => { e.currentTarget.src = POSTER_PLACEHOLDER; }}
        />
        <div className="filmography-card__overlay" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
        {movie.vote_average > 0 && (
          <div className="filmography-card__rating">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            {movie.vote_average.toFixed(1)}
          </div>
        )}
      </div>
      <div className="filmography-card__info">
        <p className="filmography-card__title">{movie.title}</p>
        <div className="filmography-card__meta">
          {year && <span className="filmography-card__year">{year}</span>}
          {movie.character && <span className="filmography-card__character">como {movie.character}</span>}
        </div>
      </div>
    </Link>
  );
};

/* Íconos de metadatos */
const IconCalendar = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IconMap = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const IconStar = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const IconFilm = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="2.18"/><line x1="7" y1="2" x2="7" y2="22"/>
    <line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/>
  </svg>
);

const ActorDetail = () => {
  const { id } = useParams();
  const { data: person, isLoading, error, refetch } = useFetch(
    (signal) => getPersonDetail(id, signal),
    [id]
  );

  const filmography = useMemo(() => {
    if (!person?.movie_credits?.cast) return [];
    return [...person.movie_credits.cast]
      .filter((m) => m.poster_path || m.release_date)
      .sort((a, b) => {
        const ya = a.release_date ? Number(a.release_date.slice(0, 4)) : 0;
        const yb = b.release_date ? Number(b.release_date.slice(0, 4)) : 0;
        return yb - ya;
      });
  }, [person]);

  if (isLoading) return <div className="actor-detail-page"><Skeleton variant="detail" /></div>;
  if (error) return (
    <div className="actor-detail-page container">
      <ErrorMessage message="No se pudo cargar el perfil de este actor." onRetry={refetch} />
    </div>
  );
  if (!person) return null;

  const {
    name, biography, profile_path, birthday, deathday,
    place_of_birth, known_for_department, also_known_as = [],
    popularity, gender,
  } = person;

  const photoUrl = profile_path ? getPosterUrl(profile_path, 'large') : AVATAR_PLACEHOLDER;
  const age = calcAge(birthday, deathday);
  const popularityScore = popularity ? Math.min(Math.round(popularity), 100) : null;

  return (
    <article className="actor-detail-page">
      {/* Fondo decorativo con foto borrosa */}
      {profile_path && (
        <div
          className="actor-detail__bg"
          style={{ backgroundImage: `url(${getPosterUrl(profile_path, 'medium')})` }}
          aria-hidden="true"
        >
          <div className="actor-detail__bg-overlay" />
        </div>
      )}

      <div className="actor-detail__content container">
        {/* Breadcrumb */}
        <nav className="actor-detail__breadcrumb" aria-label="Migas de pan">
          <Link to="/" className="breadcrumb__link">Películas</Link>
          <span className="breadcrumb__sep" aria-hidden="true">/</span>
          <Link to="/actores" className="breadcrumb__link">Actores</Link>
          <span className="breadcrumb__sep" aria-hidden="true">/</span>
          <span className="breadcrumb__current" aria-current="page">{name}</span>
        </nav>

        {/* Main: foto + info */}
        <div className="actor-detail__main">
          {/* Columna foto */}
          <aside className="actor-detail__photo-col">
            <div className="actor-detail__photo-frame">
              <img
                className="actor-detail__photo"
                src={photoUrl}
                alt={`Foto de ${name}`}
                onError={(e) => { e.currentTarget.src = AVATAR_PLACEHOLDER; }}
              />
            </div>

            {/* Mini ficha lateral */}
            <div className="actor-detail__side-info">
              {known_for_department && (
                <div className="actor-side__field">
                  <span className="actor-side__label"><IconStar /> Conocido por</span>
                  <span className="actor-side__value">{known_for_department === 'Acting' ? 'Actuación' : known_for_department}</span>
                </div>
              )}
              {gender && GENDER_LABEL[gender] && (
                <div className="actor-side__field">
                  <span className="actor-side__label"><IconFilm /> Género</span>
                  <span className="actor-side__value">{GENDER_LABEL[gender]}</span>
                </div>
              )}
              {birthday && (
                <div className="actor-side__field">
                  <span className="actor-side__label"><IconCalendar /> Nacimiento</span>
                  <span className="actor-side__value">
                    {formatDate(birthday)}
                    {age && !deathday && <span className="actor-side__age"> ({age} años)</span>}
                  </span>
                </div>
              )}
              {deathday && (
                <div className="actor-side__field">
                  <span className="actor-side__label"><IconCalendar /> Fallecimiento</span>
                  <span className="actor-side__value">
                    {formatDate(deathday)}
                    {age && <span className="actor-side__age"> ({age} años)</span>}
                  </span>
                </div>
              )}
              {place_of_birth && (
                <div className="actor-side__field">
                  <span className="actor-side__label"><IconMap /> Lugar de origen</span>
                  <span className="actor-side__value">{place_of_birth}</span>
                </div>
              )}
              {also_known_as.length > 0 && (
                <div className="actor-side__field">
                  <span className="actor-side__label"><IconFilm /> También conocido como</span>
                  <span className="actor-side__value actor-side__value--aka">
                    {also_known_as.slice(0, 3).join(' · ')}
                  </span>
                </div>
              )}
              {popularityScore && (
                <div className="actor-side__field">
                  <span className="actor-side__label"><IconStar /> Popularidad</span>
                  <div className="actor-side__popularity">
                    <div className="actor-side__popularity-bar">
                      <div
                        className="actor-side__popularity-fill"
                        style={{ width: `${Math.min(popularityScore, 100)}%` }}
                      />
                    </div>
                    <span className="actor-side__value">{popularity?.toFixed(1)}</span>
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Columna info */}
          <div className="actor-detail__info">
            <div className="actor-detail__header">
              {known_for_department && (
                <span className="actor-detail__dept-badge">
                  {known_for_department === 'Acting' ? 'Actor' : known_for_department}
                </span>
              )}
              <h1 className="actor-detail__name">{name}</h1>
            </div>

            {biography ? (
              <section className="actor-detail__bio">
                <h2 className="actor-detail__section-title">Biografía</h2>
                <p className="actor-detail__bio-text">{biography}</p>
              </section>
            ) : (
              <p className="actor-detail__no-bio">No hay biografía disponible en español para este artista.</p>
            )}
          </div>
        </div>

        {/* Filmografía */}
        {filmography.length > 0 && (
          <section className="actor-detail__filmography">
            <h2 className="actor-detail__section-title">
              Filmografía
              <span className="actor-detail__film-count">{filmography.length} películas</span>
            </h2>
            <div className="filmography-grid">
              {filmography.map((movie) => (
                <FilmographyCard key={`${movie.id}-${movie.credit_id}`} movie={movie} />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
};

export default ActorDetail;
