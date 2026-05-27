import { Link } from 'react-router-dom';
import MovieGrid from '@/components/movie/MovieGrid/MovieGrid';
import Pagination from '@/components/ui/Pagination/Pagination';
import './MovieSection.css';

const MovieSection = ({
  title,
  movies = [],
  isLoading = false,
  viewAllUrl,
  currentPage,
  totalPages,
  onPageChange,
}) => (
  <section className="movie-section">
    <div className="movie-section__header">
      <h2 className="movie-section__title">{title}</h2>
      {viewAllUrl && (
        <Link to={viewAllUrl} className="movie-section__view-all">
          Ver todos
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>
      )}
    </div>
    <MovieGrid movies={movies} isLoading={isLoading} />
    {onPageChange && totalPages > 1 && (
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    )}
  </section>
);

export default MovieSection;
