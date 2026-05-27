import MovieCard from '@/components/movie/MovieCard/MovieCard';
import Skeleton from '@/components/ui/Skeleton/Skeleton';
import './MovieGrid.css';

const SKELETON_COUNT = 12;

const MovieGrid = ({ movies = [], isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="movie-grid" aria-busy="true" aria-label="Cargando películas">
        <Skeleton variant="card" count={SKELETON_COUNT} />
      </div>
    );
  }

  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
};

export default MovieGrid;
