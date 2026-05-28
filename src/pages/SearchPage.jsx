import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMovies } from '../api/omdb';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [notFound, setNotFound] = useState(false);

  // OMDB returns 10 per page
  const totalPages = Math.ceil(totalResults / 10);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    setResults([]);
    setPage(1);
    setNotFound(false);

    searchMovies(query, 1)
      .then(({ data }) => {
        if (data.Response === 'True') {
          setResults(data.Search);
          setTotalResults(Number(data.totalResults));
        } else {
          setNotFound(true);
          setTotalResults(0);
        }
      })
      .finally(() => setLoading(false));
  }, [query]);

  const loadMore = () => {
    const next = page + 1;
    setLoadingMore(true);
    searchMovies(query, next)
      .then(({ data }) => {
        if (data.Response === 'True') {
          setResults((prev) => [...prev, ...data.Search]);
          setPage(next);
        }
      })
      .finally(() => setLoadingMore(false));
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Search header */}
      <div className="bg-gray-900/50 border-b border-white/5 py-5 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <SearchBar initialValue={query} />
          {!loading && results.length > 0 && (
            <p className="text-gray-500 text-sm whitespace-nowrap shrink-0">
              {totalResults.toLocaleString()} resultados para{' '}
              <span className="text-white">"{query}"</span>
            </p>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <p className="text-gray-500 animate-pulse">Buscando...</p>
          </div>
        ) : notFound ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🎭</p>
            <p className="text-white text-lg font-medium">Sin resultados</p>
            <p className="text-gray-500 mt-2">
              No encontramos películas para "{query}"
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {results.map((movie) => (
                <MovieCard key={movie.imdbID} movie={movie} />
              ))}
            </div>

            {page < totalPages && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-white px-8 py-3 rounded-xl transition-colors"
                >
                  {loadingMore ? 'Cargando...' : 'Cargar más'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
