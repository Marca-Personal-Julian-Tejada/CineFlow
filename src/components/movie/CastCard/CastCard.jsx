import { Link } from 'react-router-dom';
import { getPosterUrl } from '@/services/tmdb';
import './CastCard.css';

const AVATAR_PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNzUiIGN5PSI3NSIgcj0iNzUiIGZpbGw9IiMxNjE2MkEiLz48Y2lyY2xlIGN4PSI3NSIgY3k9IjYwIiByPSIyNSIgZmlsbD0iIzJBMkE0NCIvPjxwYXRoIGQ9Ik0yNSAxMzVhNTAgNTAgMCAwIDEgMTAwIDAiIGZpbGw9IiMyQTJBNDQiLz48L3N2Zz4=';

const CastCard = ({ member }) => {
  const { id, name, character, profile_path } = member;
  const photoUrl = profile_path
    ? getPosterUrl(profile_path, 'small')
    : AVATAR_PLACEHOLDER;

  return (
    <Link
      to={`/actor/${id}`}
      className="cast-card"
      aria-label={`Ver perfil de ${name}`}
    >
      <div className="cast-card__photo-wrapper">
        <img
          className="cast-card__photo"
          src={photoUrl}
          alt={name}
          loading="lazy"
          onError={(e) => { e.currentTarget.src = AVATAR_PLACEHOLDER; }}
        />
        <div className="cast-card__overlay" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </div>
      <div className="cast-card__info">
        <p className="cast-card__name">{name}</p>
        {character && <p className="cast-card__character">{character}</p>}
      </div>
    </Link>
  );
};

export default CastCard;
