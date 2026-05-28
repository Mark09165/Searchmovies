import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovieById } from '../api/omdb';
import ReviewSection from '../components/ReviewSection';
import useAuthStore from '../store/authStore';
import useFavoritesStore from '../store/favoritesStore';
import useReviewsStore from '../store/reviewsStore';

export default function MovieDetailPage() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();
  const { loadReviews } = useReviewsStore();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [favMsg, setFavMsg] = useState('');

  const fav = movie ? isFavorite(movie.imdbID) : false;

  useEffect(() => {
    setLoading(true);
    getMovieById(id)
      .then(({ data }) => {
        if (data.Response === 'True') {
          setMovie(data);
          loadReviews(id);
        } else {
          setError('Película no encontrada');
        }
      })
      .catch(() => setError('Error al cargar la película'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleFav = () => {
    if (!user || !movie) return;
    if (fav) {
      removeFavorite(user.id, movie.imdbID);
      setFavMsg('Eliminado de favoritos');
    } else {
      // Store a compact version for the favorites list
      addFavorite(user.id, {
        imdbID: movie.imdbID,
        Title: movie.Title,
        Year: movie.Year,
        Poster: movie.Poster,
        Genre: movie.Genre,
        imdbRating: movie.imdbRating,
        Plot: movie.Plot,
      });
      setFavMsg('Agregado a favoritos ❤️');
    }
    setTimeout(() => setFavMsg(''), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-500 animate-pulse text-lg">Cargando...</p>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-4">
        <p className="text-5xl">🎬</p>
        <p className="text-white text-lg">{error || 'Película no encontrada'}</p>
        <Link to="/" className="text-indigo-400 hover:text-indigo-300">
          Volver al inicio
        </Link>
      </div>
    );
  }

  const poster =
    movie.Poster && movie.Poster !== 'N/A'
      ? movie.Poster
      : `https://placehold.co/400x600/1f2937/6b7280?text=${encodeURIComponent(movie.Title)}`;

  const genres = movie.Genre !== 'N/A' ? movie.Genre?.split(', ') : [];
  const actors = movie.Actors !== 'N/A' ? movie.Actors : null;
  const director = movie.Director !== 'N/A' ? movie.Director : null;
  const runtime = movie.Runtime !== 'N/A' ? movie.Runtime : null;
  const rating = movie.imdbRating !== 'N/A' ? movie.imdbRating : null;
  const votes = movie.imdbVotes !== 'N/A' ? movie.imdbVotes : null;
  const metascore = movie.Metascore !== 'N/A' ? movie.Metascore : null;

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 pb-16">
        <div className="flex flex-col sm:flex-row gap-8">
          {/* Poster */}
          <div className="shrink-0 mx-auto sm:mx-0">
            <img
              src={poster}
              alt={movie.Title}
              className="w-52 sm:w-60 rounded-xl shadow-2xl border border-white/5"
            />
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-white text-3xl sm:text-4xl font-bold leading-tight">
              {movie.Title}
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 mt-3 text-sm">
              {movie.Year && <span className="text-gray-400">📅 {movie.Year}</span>}
              {runtime && <span className="text-gray-400">⏱ {runtime}</span>}
              {movie.Rated && movie.Rated !== 'N/A' && (
                <span className="border border-white/20 text-gray-400 px-2 py-0.5 rounded text-xs">
                  {movie.Rated}
                </span>
              )}
              {rating && (
                <span className="flex items-center gap-1 bg-yellow-500/15 text-yellow-400 font-bold px-2.5 py-0.5 rounded-full">
                  ★ {rating}/10
                  {votes && <span className="text-yellow-500/60 font-normal text-xs">({votes})</span>}
                </span>
              )}
              {metascore && (
                <span className="bg-green-500/15 text-green-400 font-bold px-2.5 py-0.5 rounded-full text-xs">
                  Metascore {metascore}
                </span>
              )}
            </div>

            {/* Genres */}
            {genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {genres.map((g) => (
                  <span
                    key={g}
                    className="bg-gray-800 text-gray-300 text-xs px-3 py-1 rounded-full border border-white/5"
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}

            {/* Plot */}
            {movie.Plot && movie.Plot !== 'N/A' && (
              <p className="text-gray-300 text-sm leading-relaxed mt-5">{movie.Plot}</p>
            )}

            {/* Credits */}
            <div className="mt-4 space-y-1.5 text-sm">
              {director && (
                <p className="text-gray-400">
                  <span className="text-gray-500">Director:</span>{' '}
                  <span className="text-white">{director}</span>
                </p>
              )}
              {actors && (
                <p className="text-gray-400">
                  <span className="text-gray-500">Reparto:</span>{' '}
                  <span className="text-white">{actors}</span>
                </p>
              )}
              {movie.Language && movie.Language !== 'N/A' && (
                <p className="text-gray-400">
                  <span className="text-gray-500">Idioma:</span>{' '}
                  <span className="text-white">{movie.Language}</span>
                </p>
              )}
              {movie.Country && movie.Country !== 'N/A' && (
                <p className="text-gray-400">
                  <span className="text-gray-500">País:</span>{' '}
                  <span className="text-white">{movie.Country}</span>
                </p>
              )}
              {movie.Awards && movie.Awards !== 'N/A' && (
                <p className="text-gray-400">
                  <span className="text-gray-500">Premios:</span>{' '}
                  <span className="text-white">{movie.Awards}</span>
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 mt-6">
              {user ? (
                <button
                  onClick={handleFav}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                    fav
                      ? 'bg-red-500/15 text-red-400 border-red-500/30 hover:bg-red-500/25'
                      : 'bg-gray-800 text-gray-300 border-white/10 hover:border-red-500/40 hover:text-red-400'
                  }`}
                >
                  {fav ? '❤️ En favoritos' : '🤍 Agregar a favoritos'}
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 bg-gray-800 text-gray-400 border border-white/10 hover:border-indigo-500/40 hover:text-indigo-400 px-5 py-2.5 rounded-xl text-sm transition-all"
                >
                  🔐 Inicia sesión para guardar
                </Link>
              )}
            </div>

            {favMsg && (
              <p className="text-green-400 text-sm mt-3">{favMsg}</p>
            )}
          </div>
        </div>

        {/* Ratings from other sources */}
        {movie.Ratings && movie.Ratings.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-3">
            {movie.Ratings.map((r) => (
              <div
                key={r.Source}
                className="bg-gray-800/60 border border-white/5 rounded-xl px-4 py-3 text-center min-w-[120px]"
              >
                <p className="text-white font-bold text-lg">{r.Value}</p>
                <p className="text-gray-500 text-xs mt-0.5">{r.Source}</p>
              </div>
            ))}
          </div>
        )}

        {/* Reviews */}
        <ReviewSection imdbID={id} />
      </div>
    </div>
  );
}
