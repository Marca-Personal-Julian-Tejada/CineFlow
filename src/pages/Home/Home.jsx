import { useState, useMemo, useCallback } from 'react';
import useFetch from '@/hooks/useFetch';
import { getNowPlaying, getPopular } from '@/services/tmdb';
import HeroCarousel from '@/components/movie/HeroCarousel/HeroCarousel';
import HomeSearchBar from '@/components/search/HomeSearchBar/HomeSearchBar';
import MovieSection from '@/components/movie/MovieSection/MovieSection';
import ErrorMessage from '@/components/ui/ErrorMessage/ErrorMessage';
import './Home.css';

const PaginatedSection = ({ title, fetchFn }) => {
  const [page, setPage] = useState(1);

  const { data, isLoading, error, refetch } = useFetch(
    useCallback((signal) => fetchFn(page, signal), [page]), // eslint-disable-line
    [page]
  );

  const movies = data?.results || [];
  const totalPages = data?.total_pages ? Math.min(data.total_pages, 500) : 0;

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: document.getElementById('catalogo')?.offsetTop - 80 ?? 0, behavior: 'smooth' });
  };

  if (error) {
    return <ErrorMessage message={`No se pudo cargar "${title}".`} onRetry={refetch} />;
  }

  return (
    <MovieSection
      title={title}
      movies={movies}
      isLoading={isLoading}
      currentPage={page}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />
  );
};

const Home = () => {
  const { data: nowPlayingData } = useFetch((signal) => getNowPlaying(1, signal), []);

  const heroMovies = useMemo(() => {
    const movies = nowPlayingData?.results || [];
    return movies.filter((m) => m.backdrop_path).slice(0, 8);
  }, [nowPlayingData]);

  return (
    <div className="home">
      <HeroCarousel movies={heroMovies} />
      <HomeSearchBar />

      <div id="catalogo" className="home__sections container">
        <PaginatedSection title="En cartelera ahora" fetchFn={getNowPlaying} />
        <PaginatedSection title="Más populares" fetchFn={getPopular} />
      </div>
    </div>
  );
};

export default Home;
