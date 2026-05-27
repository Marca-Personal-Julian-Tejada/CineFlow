export const STORAGE_KEYS = {
  WATCHED: 'CINEFLOW_WATCHED',
  FAVORITES: 'CINEFLOW_FAVORITES',
  PENDING: 'CINEFLOW_PENDING',
};

export const DEBOUNCE_DELAY = 500;
export const PAGE_SIZE = 20;
export const MAX_VISIBLE_PAGES = 5;

export const RATING_OPTIONS = [
  { label: 'Todas', value: null },
  { label: '9+', value: 9 },
  { label: '8+', value: 8 },
  { label: '7+', value: 7 },
  { label: '6+', value: 6 },
];

export const YEAR_OPTIONS = (() => {
  const currentYear = new Date().getFullYear();
  const years = [{ label: 'Todos', value: null }];
  for (let y = currentYear; y >= 2000; y--) {
    years.push({ label: String(y), value: y });
  }
  return years;
})();
