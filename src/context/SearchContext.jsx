import { createContext, useContext, useState } from 'react';

const SearchContext = createContext(null);

export const SearchProvider = ({ children }) => {
  const [query, setQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({ genre: null, year: null, rating: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const setFilter = (type, value) => {
    setActiveFilters((prev) => ({ ...prev, [type]: value }));
    setCurrentPage(1);
  };

  const clearFilter = (type) => {
    setActiveFilters((prev) => ({ ...prev, [type]: null }));
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setActiveFilters({ genre: null, year: null, rating: null });
    setCurrentPage(1);
  };

  const updateResults = (movies, pages) => {
    setResults(movies);
    setTotalPages(pages);
  };

  return (
    <SearchContext.Provider
      value={{
        query,
        setQuery,
        activeFilters,
        setFilter,
        clearFilter,
        clearAllFilters,
        currentPage,
        setCurrentPage,
        totalPages,
        results,
        isLoading,
        setIsLoading,
        error,
        setError,
        updateResults,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) throw new Error('useSearch debe usarse dentro de SearchProvider');
  return context;
};
