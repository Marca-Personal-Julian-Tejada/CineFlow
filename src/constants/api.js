export const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const POSTER_SIZES = {
  small: 'w185',
  medium: 'w342',
  large: 'w500',
  original: 'original',
};

export const BACKDROP_SIZES = {
  medium: 'w780',
  large: 'w1280',
  original: 'original',
};

export const ENDPOINTS = {
  NOW_PLAYING: '/movie/now_playing',
  UPCOMING: '/movie/upcoming',
  POPULAR: '/movie/popular',
  SEARCH: '/search/movie',
  DISCOVER: '/discover/movie',
  MOVIE_DETAIL: (id) => `/movie/${id}`,
  GENRES: '/genre/movie/list',
  POPULAR_PEOPLE: '/person/popular',
  SEARCH_PEOPLE: '/search/person',
  PERSON_DETAIL: (id) => `/person/${id}`,
  // TV Series endpoints
  POPULAR_TV: '/tv/popular',
  DISCOVER_TV: '/discover/tv',
  SEARCH_TV: '/search/tv',
  TV_DETAIL: (id) => `/tv/${id}`,
  TV_GENRES: '/genre/tv/list',
};
