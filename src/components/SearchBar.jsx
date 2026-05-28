import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchMovies } from '../api/omdb';
import { useDebounce } from '../hooks/useDebounce';

export default function SearchBar({ large = false, initialValue = '' }) {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 350);
  const navigate = useNavigate();
  const wrapperRef = useRef(null);

  // Reactive suggestions
  useEffect(() => {
    if (debouncedQuery.trim().length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    searchMovies(debouncedQuery)
      .then(({ data }) => {
        if (data.Response === 'True') {
          setSuggestions(data.Search.slice(0, 6));
          setOpen(true);
        } else {
          setSuggestions([]);
          setOpen(false);
        }
      })
      .catch(() => setSuggestions([]))
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const submit = (e) => {
    e?.preventDefault();
    if (!query.trim()) return;
    setOpen(false);
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const selectMovie = (movie) => {
    setOpen(false);
    setQuery('');
    navigate(`/movie/${movie.imdbID}`);
  };

  return (
    <div ref={wrapperRef} className={`relative w-full ${large ? 'max-w-2xl' : 'max-w-sm'}`}>
      <form onSubmit={submit}>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
            🔍
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => suggestions.length > 0 && setOpen(true)}
            placeholder="Buscar películas..."
            className={`w-full bg-gray-800/80 border border-white/10 focus:border-indigo-500/60 text-white placeholder-gray-500 rounded-xl pl-10 pr-4 outline-none transition-all ${
              large ? 'py-4 text-base' : 'py-2.5 text-sm'
            }`}
          />
          {loading && (
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs animate-spin select-none">
              ◌
            </span>
          )}
        </div>
      </form>

      {/* Dropdown */}
      {open && suggestions.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-gray-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
          {suggestions.map((movie) => {
            const poster =
              movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : null;
            return (
              <button
                key={movie.imdbID}
                onClick={() => selectMovie(movie)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition-colors text-left"
              >
                <div className="w-8 h-12 rounded overflow-hidden bg-gray-800 shrink-0">
                  {poster ? (
                    <img src={poster} alt={movie.Title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600 text-lg">🎬</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{movie.Title}</p>
                  <p className="text-gray-500 text-xs">{movie.Year}</p>
                </div>
              </button>
            );
          })}
          <button
            onClick={submit}
            className="w-full px-4 py-2.5 text-indigo-400 hover:text-indigo-300 text-sm text-center border-t border-white/5 hover:bg-gray-800 transition-colors"
          >
            Ver todos los resultados para "{query}"
          </button>
        </div>
      )}
    </div>
  );
}
