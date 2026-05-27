import { BASE_URL, ENDPOINTS, IMAGE_BASE_URL, POSTER_SIZES, BACKDROP_SIZES } from '@/constants/api';

const getToken = () => import.meta.env.VITE_TOKEN_ACCESO;

const buildHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
  'Content-Type': 'application/json',
});

const buildUrl = (endpoint, params = {}) => {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set('language', 'es-ES');
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });
  return url.toString();
};

const apiFetch = async (endpoint, params = {}, signal) => {
  const url = buildUrl(endpoint, params);
  const response = await fetch(url, {
    headers: buildHeaders(),
    signal,
  });
  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }
  return response.json();
};

export const getNowPlaying = (page = 1, signal) =>
  apiFetch(ENDPOINTS.NOW_PLAYING, { page, region: 'CO' }, signal);

export const getUpcoming = (page = 1, signal) =>
  apiFetch(ENDPOINTS.UPCOMING, { page, region: 'CO' }, signal);

export const getPopular = (page = 1, signal) =>
  apiFetch(ENDPOINTS.POPULAR, { page, region: 'CO' }, signal);

export const searchMovies = ({ query, page = 1 }, signal) =>
  apiFetch(ENDPOINTS.SEARCH, { query, page }, signal);

export const discoverMovies = ({ genreId, year, ratingGte, page = 1 }, signal) => {
  const params = { page };
  if (genreId) params['with_genres'] = genreId;
  if (year) params['primary_release_year'] = year;
  if (ratingGte) params['vote_average.gte'] = ratingGte;
  return apiFetch(ENDPOINTS.DISCOVER, params, signal);
};

export const getMovieDetail = (id, signal) =>
  apiFetch(ENDPOINTS.MOVIE_DETAIL(id), { append_to_response: 'credits,videos' }, signal);

export const getGenres = (signal) =>
  apiFetch(ENDPOINTS.GENRES, {}, signal);

export const getPopularPeople = (page = 1, signal) =>
  apiFetch(ENDPOINTS.POPULAR_PEOPLE, { page }, signal);

export const searchPeople = ({ query, page = 1 }, signal) =>
  apiFetch(ENDPOINTS.SEARCH_PEOPLE, { query, page }, signal);

export const getPersonDetail = (id, signal) =>
  apiFetch(ENDPOINTS.PERSON_DETAIL(id), { append_to_response: 'movie_credits' }, signal);

export const getPosterUrl = (posterPath, size = 'large') =>
  posterPath ? `${IMAGE_BASE_URL}/${POSTER_SIZES[size]}${posterPath}` : null;

export const getBackdropUrl = (backdropPath, size = 'large') =>
  backdropPath ? `${IMAGE_BASE_URL}/${BACKDROP_SIZES[size]}${backdropPath}` : null;

// TV Series
export const getPopularTV = (page = 1, signal) =>
  apiFetch(ENDPOINTS.POPULAR_TV, { page, region: 'CO' }, signal);

export const discoverTV = ({ genreId, year, ratingGte, page = 1 }, signal) => {
  const params = { page };
  if (genreId) params['with_genres'] = genreId;
  if (year) params['first_air_date_year'] = year;
  if (ratingGte) params['vote_average.gte'] = ratingGte;
  return apiFetch(ENDPOINTS.DISCOVER_TV, params, signal);
};

export const searchTV = ({ query, page = 1 }, signal) =>
  apiFetch(ENDPOINTS.SEARCH_TV, { query, page }, signal);

export const getTVDetail = (id, signal) =>
  apiFetch(ENDPOINTS.TV_DETAIL(id), { append_to_response: 'credits,videos' }, signal);

export const getTVGenres = (signal) =>
  apiFetch(ENDPOINTS.TV_GENRES, {}, signal);
