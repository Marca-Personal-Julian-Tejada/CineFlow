import { useSearchParams } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import useFetch from '@/hooks/useFetch';
import { getPopularTV, getTVGenres, discoverTV, searchTV } from '@/services/tmdb';
import SeriesHeroCarousel from '@/components/series/SeriesHeroCarousel/SeriesHeroCarousel';
import SeriesSearchBar from '@/components/search/SeriesSearchBar/SeriesSearchBar';
import SeriesFilterBar from '@/components/series/SeriesFilterBar/SeriesFilterBar';
import SeriesCard from '@/components/series/SeriesCard/SeriesCard';
import Skeleton from '@/components/ui/Skeleton/Skeleton';
import Pagination from '@/components/ui/Pagination/Pagination';
import ErrorMessage from '@/components/ui/ErrorMessage/ErrorMessage';
import './Series.css';

const Series = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [series, setSeries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(0);

  const query = searchParams.get('q');
  const genreId = searchParams.get('genero');
  const year = searchParams.get('year');
  const rating = searchParams.get('rating');
  const sortBy = searchParams.get('sort') || 'popularity.desc';
  const providers = searchParams.get('with_watch_providers');
  const region = searchParams.get('watch_region') || 'CO';

  const { data: genresData } = useFetch(
    (signal) => getTVGenres(signal),
    []
  );

  const { data: heroData } = useFetch(
    (signal) => getPopularTV(1, signal),
    []
  );

  const heroSeries = useMemo(() => {
    const allSeries = heroData?.results || [];
    return allSeries.filter((s) => s.backdrop_path).slice(0, 8);
  }, [heroData]);

  useEffect(() => {
    const fetchSeries = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const controller = new AbortController();
        let data;

        if (query) {
          data = await searchTV({ query, page: currentPage }, controller.signal);
        } else {
          const filters = {
            genreId: genreId ? parseInt(genreId) : null,
            year: year ? parseInt(year) : null,
            ratingGte: rating ? parseFloat(rating) : null,
            providers,
            region,
            page: currentPage,
          };
          data = await discoverTV(filters, controller.signal);
        }

        setSeries(data.results || []);
        setTotalPages(data.total_pages || 0);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeries();
  }, [query, genreId, year, rating, providers, region, currentPage, sortBy]);

  const handleFilterChange = (newFilters) => {
    const params = new URLSearchParams(searchParams);
    Object.keys(newFilters).forEach(key => {
      if (newFilters[key]) {
        params.set(key, newFilters[key]);
      } else {
        params.delete(key);
      }
    });
    params.set('page', '1');
    setCurrentPage(1);
    setSearchParams(params);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="series-page">
      {heroSeries.length > 0 && <SeriesHeroCarousel series={heroSeries} />}
      <SeriesSearchBar />

      <div className="series-page__content container">
        <SeriesFilterBar
          onFilterChange={handleFilterChange}
          genres={genresData?.genres || []}
          selectedGenres={genreId ? [parseInt(genreId)] : []}
          selectedSort={sortBy}
          selectedProviders={providers ? providers.split('|').map(Number) : []}
          selectedCountry={region}
        />

        {error && (
          <ErrorMessage message="No se pudieron cargar las series. Por favor, intenta de nuevo." onRetry={() => window.location.reload()} />
        )}

        {isLoading ? (
          <div className="series-grid">
            {[...Array(12)].map((_, i) => (
              <Skeleton key={i} variant="card" />
            ))}
          </div>
        ) : series.length > 0 ? (
          <>
            <div className="series-grid">
              {series.map((s) => (
                <SeriesCard key={s.id} series={s} />
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={Math.min(totalPages, 500)}
                onPageChange={handlePageChange}
              />
            )}
          </>
        ) : (
          <div className="series-empty">
            <p>No se encontraron series con los filtros seleccionados.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Series;
