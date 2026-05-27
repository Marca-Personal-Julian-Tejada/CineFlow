import { createContext, useContext, useEffect } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/constants/app';

const LibraryContext = createContext(null);

const toLibraryItem = (movie) => ({
  id: movie.id,
  title: movie.title,
  poster_path: movie.poster_path || null,
  release_date: movie.release_date || '',
  vote_average: movie.vote_average || 0,
  addedAt: new Date().toISOString(),
});

export const LibraryProvider = ({ children }) => {
  const [watched, setWatched] = useLocalStorage(STORAGE_KEYS.WATCHED, []);
  const [favorites, setFavorites] = useLocalStorage(STORAGE_KEYS.FAVORITES, []);
  const [pending, setPending] = useLocalStorage(STORAGE_KEYS.PENDING, []);

  const isWatched = (id) => watched.some((m) => m.id === id);
  const isFavorite = (id) => favorites.some((m) => m.id === id);
  const isPending = (id) => pending.some((m) => m.id === id);

  const addToWatched = (movie) => {
    if (!isWatched(movie.id)) {
      setWatched((prev) => [toLibraryItem(movie), ...prev]);
    }
  };
  const removeFromWatched = (id) =>
    setWatched((prev) => prev.filter((m) => m.id !== id));

  const addToFavorites = (movie) => {
    if (!isFavorite(movie.id)) {
      setFavorites((prev) => [toLibraryItem(movie), ...prev]);
    }
  };
  const removeFromFavorites = (id) =>
    setFavorites((prev) => prev.filter((m) => m.id !== id));

  const addToPending = (movie) => {
    if (!isPending(movie.id)) {
      setPending((prev) => [toLibraryItem(movie), ...prev]);
    }
  };
  const removeFromPending = (id) =>
    setPending((prev) => prev.filter((m) => m.id !== id));

  const toggleWatched = (movie) =>
    isWatched(movie.id) ? removeFromWatched(movie.id) : addToWatched(movie);
  const toggleFavorite = (movie) =>
    isFavorite(movie.id) ? removeFromFavorites(movie.id) : addToFavorites(movie);
  const togglePending = (movie) =>
    isPending(movie.id) ? removeFromPending(movie.id) : addToPending(movie);

  return (
    <LibraryContext.Provider
      value={{
        watched,
        favorites,
        pending,
        isWatched,
        isFavorite,
        isPending,
        toggleWatched,
        toggleFavorite,
        togglePending,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) throw new Error('useLibrary debe usarse dentro de LibraryProvider');
  return context;
};
