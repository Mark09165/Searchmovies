import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useFavoritesStore from '../store/favoritesStore';

export default function MovieCard({ movie }) {
  const { user } = useAuthStore();
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();
  const fav = isFavorite(movie.imdbID);

  const poster =
    movie.Poster && movie.Poster !== 'N/A'
      ? movie.Poster
      : `https://placehold.co/300x450/1f2937/6b7280?text=${encodeURIComponent(movie.Title)}`;

  const handleFav = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    fav ? removeFavorite(user.id, movie.imdbID) : addFavorite(user.id, movie);
  };

  return (
    <Link to={`/movie/${movie.imdbID}`} className="group block">
      <div className="relative bg-gray-900 rounded-xl overflow-hidden border border-white/5 hover:border-indigo-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10">

        {/* Poster */}
        <div className="relative aspect-[2/3] overflow-hidden bg-gray-800">
          <img
            src={poster}
            alt={movie.Title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Fav button */}
          {user && (
            <button
              onClick={handleFav}
              aria-label={fav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              className={`absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full backdrop-blur-sm text-sm transition-all duration-200 ${
                fav
                  ? 'bg-red-500/90 scale-110'
                  : 'bg-gray-900/70 text-gray-400 hover:bg-red-500/80 hover:text-white'
              }`}
            >
              {fav ? '❤️' : '🤍'}
            </button>
          )}

          {/* Year badge */}
          {movie.Year && (
            <span className="absolute bottom-2 left-2 bg-gray-900/80 backdrop-blur-sm text-gray-300 text-xs px-2 py-0.5 rounded-full">
              {movie.Year}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          <h3 className="text-white text-sm font-medium line-clamp-2 leading-snug">
            {movie.Title}
          </h3>
          {movie.Type && (
            <p className="text-gray-500 text-xs mt-0.5 capitalize">{movie.Type}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
