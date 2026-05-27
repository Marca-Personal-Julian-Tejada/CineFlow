import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLibrary } from '@/context/LibraryContext';
import LibraryTabs from '@/components/library/LibraryTabs/LibraryTabs';
import MovieGrid from '@/components/movie/MovieGrid/MovieGrid';
import EmptyState from '@/components/ui/EmptyState/EmptyState';
import './Library.css';

const EMPTY_MESSAGES = {
  vistas: {
    title: 'No has visto ninguna película',
    description: 'Marca películas como vistas desde su página de detalle.',
  },
  favoritas: {
    title: 'No tienes películas favoritas',
    description: 'Añade películas a tus favoritos desde su página de detalle.',
  },
  pendientes: {
    title: 'No tienes películas pendientes',
    description: 'Añade películas a tu lista de pendientes para verlas más tarde.',
  },
};

const Library = () => {
  const [activeTab, setActiveTab] = useState('vistas');
  const { watched, favorites, pending } = useLibrary();

  const tabData = { vistas: watched, favoritas: favorites, pendientes: pending };
  const currentMovies = tabData[activeTab] || [];

  const counts = {
    vistas: watched.length,
    favoritas: favorites.length,
    pendientes: pending.length,
  };

  const empty = EMPTY_MESSAGES[activeTab];

  return (
    <div className="library-page">
      <div className="container">
        <header className="library-page__header">
          <div className="library-page__greeting">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <div>
              <h1 className="library-page__title">Hola, cinéfilo</h1>
              <p className="library-page__subtitle">Tu colección personal de CineFlow</p>
            </div>
          </div>
        </header>

        <LibraryTabs activeTab={activeTab} counts={counts} onTabChange={setActiveTab} />

        <div
          role="tabpanel"
          id={`panel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
        >
          {currentMovies.length === 0 ? (
            <EmptyState
              title={empty.title}
              description={empty.description}
              action={
                <Link to="/" className="library-empty-btn">
                  Explorar películas
                </Link>
              }
            />
          ) : (
            <MovieGrid movies={currentMovies} isLoading={false} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Library;
