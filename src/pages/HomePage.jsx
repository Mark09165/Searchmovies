import { useState, useEffect } from 'react';
import { searchMovies } from '../api/omdb';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';
import useAuthStore from '../store/authStore';
import useFavoritesStore from '../store/favoritesStore';

// A few curated searches to populate the home page
const FEATURED_SEARCHES = ['Marvel', 'Star Wars', 'Batman'];

export default function HomePage() {
  const { user } = useAuthStore();
  const { loadForUser } = useFavoritesStore();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadForUser(user.id);

    Promise.all(FEATURED_SEARCHES.map((q) => searchMovies(q)))
      .then((results) => {
        const built = results
          .map((res, i) => ({
            title: FEATURED_SEARCHES[i],
            movies: res.data.Response === 'True' ? res.data.Search.slice(0, 8) : [],
          }))
          .filter((s) => s.movies.length > 0);
        setSections(built);
      })
      .finally(() => setLoading(false));
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero */}
      <div className="relative bg-gradient-to-b from-indigo-950/40 to-gray-950 py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-white text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Descubre tu próxima
            <span className="text-indigo-400"> película favorita</span>
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            Busca, guarda favoritos y comparte tus reseñas
          </p>
          <div className="flex justify-center">
            <SearchBar large />
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        {loading ? (
          <div className="flex justify-center py-20">
            <p className="text-gray-500 animate-pulse">Cargando películas...</p>
          </div>
        ) : (
          sections.map((section) => (
            <section key={section.title} className="mb-12">
              <h2 className="text-white text-xl font-semibold mb-5">
                🎬 {section.title}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
                {section.movies.map((movie) => (
                  <MovieCard key={movie.imdbID} movie={movie} />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
