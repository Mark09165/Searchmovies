import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useFavoritesStore from '../store/favoritesStore';

export default function FavoritesPage() {
  const { user } = useAuthStore();
  const { favorites, removeFavorite } = useFavoritesStore();

  const poster = (movie) =>
    movie.Poster && movie.Poster !== 'N/A'
      ? movie.Poster
      : `https://placehold.co/100x150/1f2937/6b7280?text=${encodeURIComponent(movie.Title)}`;

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="text-white text-3xl font-bold">Mis favoritos</h1>
          <p className="text-gray-500 mt-1">
            {favorites.length}{' '}
            {favorites.length === 1 ? 'película guardada' : 'películas guardadas'}
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🎬</p>
            <p className="text-white text-xl font-medium">No tienes favoritos aún</p>
            <p className="text-gray-500 mt-2 mb-6">
              Explora películas y guarda las que más te gusten
            </p>
            <Link
              to="/"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl transition-colors"
            >
              Explorar películas
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map((movie) => (
              <div
                key={movie.imdbID}
                className="bg-gray-900 border border-white/5 hover:border-white/10 rounded-xl overflow-hidden transition-all group"
              >
                <Link to={`/movie/${movie.imdbID}`} className="flex gap-4 p-4">
                  <img
                    src={poster(movie)}
                    alt={movie.Title}
                    className="w-16 h-24 object-cover rounded-lg shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium text-sm line-clamp-2 leading-snug">
                      {movie.Title}
                    </h3>
                    <p className="text-gray-500 text-xs mt-1">{movie.Year}</p>
                    {movie.imdbRating && (
                      <p className="text-yellow-400 text-xs mt-1">★ {movie.imdbRating}</p>
                    )}
                    {movie.Genre && (
                      <p className="text-gray-600 text-xs mt-1 truncate">{movie.Genre}</p>
                    )}
                    {movie.Plot && movie.Plot !== 'N/A' && (
                      <p className="text-gray-600 text-xs mt-2 line-clamp-2 leading-relaxed">
                        {movie.Plot}
                      </p>
                    )}
                  </div>
                </Link>
                <div className="px-4 pb-4">
                  <button
                    onClick={() => removeFavorite(user.id, movie.imdbID)}
                    className="w-full text-xs text-gray-500 hover:text-red-400 border border-white/5 hover:border-red-500/20 py-2 rounded-lg transition-all"
                  >
                    ✕ Quitar de favoritos
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
