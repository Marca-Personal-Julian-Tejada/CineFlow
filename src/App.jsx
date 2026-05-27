import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { LibraryProvider } from '@/context/LibraryContext';
import { SearchProvider } from '@/context/SearchContext';
import Navbar from '@/components/layout/Navbar/Navbar';
import Footer from '@/components/layout/Footer/Footer';
import Home from '@/pages/Home/Home';
import Search from '@/pages/Search/Search';
import Genres from '@/pages/Genres/Genres';
import MovieDetail from '@/pages/MovieDetail/MovieDetail';
import Library from '@/pages/Library/Library';
import Actors from '@/pages/Actors/Actors';
import ActorDetail from '@/pages/ActorDetail/ActorDetail';
import Series from '@/pages/Series/Series';
import SeriesDetail from '@/pages/SeriesDetail/SeriesDetail';
import './App.css';

const Layout = ({ children }) => (
  <>
    <Navbar />
    <main className="main-content">{children}</main>
    <Footer />
  </>
);

const router = createBrowserRouter([
  { path: '/', element: <Layout><Home /></Layout> },
  { path: '/buscar', element: <Layout><Search /></Layout> },
  { path: '/series', element: <Layout><Series /></Layout> },
  { path: '/serie/:id', element: <Layout><SeriesDetail /></Layout> },
  { path: '/generos', element: <Layout><Genres /></Layout> },
  { path: '/pelicula/:id', element: <Layout><MovieDetail /></Layout> },
  { path: '/mi-biblioteca', element: <Layout><Library /></Layout> },
  { path: '/actores', element: <Layout><Actors /></Layout> },
  { path: '/actor/:id', element: <Layout><ActorDetail /></Layout> },
  { path: '*', element: <Navigate to="/" replace /> },
]);

const App = () => (
  <LibraryProvider>
    <SearchProvider>
      <RouterProvider router={router} />
    </SearchProvider>
  </LibraryProvider>
);

export default App;
