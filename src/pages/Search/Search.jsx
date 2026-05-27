import { useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSearch } from '@/context/SearchContext';
import { searchMovies, discoverMovies } from '@/services/tmdb';
import SearchBar from '@/components/search/SearchBar/SearchBar';
import FilterBar from '@/components/search/FilterBar/FilterBar';
import MovieGrid from '@/components/movie/MovieGrid/MovieGrid';
import Pagination from '@/components/ui/Pagination/Pagination';
import ErrorMessage from '@/components/ui/ErrorMessage/ErrorMessage';
import EmptyState from '@/components/ui/EmptyState/EmptyState';
import './Search.css';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    query, setQuery,
    activeFilters, setFilter, clearAllFilters,
    currentPage, setCurrentPage,
    totalPages,
    results,
    isLoading, setIsLoading,
    error, setError,
    updateResults,
  } = useSearch();

  const abortRef = useRef(null);

  // Sincronizar estado con URL al montar
  useEffect(() => {
    const q = searchParams.get('q') || '';
    const genre = searchParams.get('genero') ? Number(searchParams.get('genero')) : null;
    const year = searchParams.get('year') ? Number(searchParams.get('year')) : null;
    const rating = searchParams.get('rating') ? Number(searchParams.get('rating')) : null;
    const page = searchParams.get('pagina') ? Number(searchParams.get('pagina')) : 1;

    setQuery(q);
    if (genre) setFilter('genre', genre);
    if (year) setFilter('year', year);
    if (rating) setFilter('rating', rating);
    setCurrentPage(page);
  }, []); // eslint-disable-line

  const fetchMovies = useCallback(async (q, filters, page) => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);
    setError(null);

    try {
      let movies = [];
      let pages = 0;

      if (q) {
        // Búsqueda por texto: /search/movie no admite filtros de género/año/rating,
        // por eso traemos múltiples páginas y filtramos localmente cuando hay filtros activos.
        const hasFilters = filters.genre || filters.year || filters.rating;

        if (!hasFilters) {
          // Sin filtros: búsqueda directa paginada
          const data = await searchMovies({ query: q, page }, controller.signal);
          movies = data.results || [];
          pages = Math.min(data.total_pages || 0, 500);
        } else {
          // Con filtros: traemos hasta 5 páginas y filtramos localmente
          // para dar resultados coherentes con el texto + filtros combinados
          const pagePromises = [];
          for (let p = 1; p <= 5; p++) {
            pagePromises.push(searchMovies({ query: q, page: p }, controller.signal));
          }
          const results = await Promise.all(pagePromises);
          const allMovies = results.flatMap((d) => d.results || []);

          // Filtrar localmente por género, año y rating
          movies = allMovies.filter((m) => {
            if (filters.genre && !(m.genre_ids || []).includes(filters.genre)) return false;
            if (filters.year) {
              const movieYear = m.release_date ? Number(m.release_date.slice(0, 4)) : null;
              if (movieYear !== filters.year) return false;
            }
            if (filters.rating && m.vote_average < filters.rating) return false;
            return true;
          });

          // Paginación local sobre los resultados filtrados
          const pageSize = 20;
          pages = Math.ceil(movies.length / pageSize);
          movies = movies.slice((page - 1) * pageSize, page * pageSize);
        }
      } else {
        // Sin texto: usar /discover/movie con los filtros de la API
        const data = await discoverMovies({
          genreId: filters.genre,
          year: filters.year,
          ratingGte: filters.rating,
          page,
        }, controller.signal);
        movies = data.results || [];
        pages = Math.min(data.total_pages || 0, 500);
      }

      if (!controller.signal.aborted) {
        updateResults(movies, pages);
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        setError('Error al cargar los resultados. Intenta de nuevo.');
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, [setIsLoading, setError, updateResults]);

  // Lanzar búsqueda cuando cambian query/filtros/página
  useEffect(() => {
    fetchMovies(query, activeFilters, currentPage);

    // Sincronizar URL
    const params = {};
    if (query) params.q = query;
    if (activeFilters.genre) params.genero = activeFilters.genre;
    if (activeFilters.year) params.year = activeFilters.year;
    if (activeFilters.rating) params.rating = activeFilters.rating;
    if (currentPage > 1) params.pagina = currentPage;
    setSearchParams(params, { replace: true });
  }, [query, activeFilters, currentPage]); // eslint-disable-line

  const handleSearch = (value) => {
    setQuery(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (type, value) => {
    if (type === 'clear') {
      clearAllFilters();
    } else {
      setFilter(type, value);
    }
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageTitle = () => {
    if (query) return `Resultados para "${query}"`;
    return 'Explorar películas';
  };

  return (
    <div className="search-page">
      <div className="container">
        <div className="search-page__header">
          <h1 className="search-page__title">{getPageTitle()}</h1>
          <SearchBar initialValue={query} onSearch={handleSearch} />
          <FilterBar activeFilters={activeFilters} onFilterChange={handleFilterChange} />
        </div>

        {error ? (
          <ErrorMessage message={error} onRetry={() => fetchMovies(query, activeFilters, currentPage)} />
        ) : results.length === 0 && !isLoading ? (
          <EmptyState
            title="Sin resultados"
            description={query ? `No encontramos películas para "${query}". Prueba con otro término.` : 'Usa el buscador o selecciona filtros para encontrar películas.'}
          />
        ) : (
          <>
            <MovieGrid movies={results} isLoading={isLoading} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Search;
