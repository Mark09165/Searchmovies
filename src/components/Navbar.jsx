import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useFavoritesStore from '../store/favoritesStore';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { clearFavorites } = useFavoritesStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => {
    logout();
    clearFavorites();
    navigate('/login');
  };

  const active = (path) =>
    pathname === path
      ? 'text-white font-medium'
      : 'text-gray-400 hover:text-white transition-colors';

  return (
    <header className="sticky top-0 z-50 bg-gray-950/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0 group">
          <span className="text-2xl">🎬</span>
          <span className="text-white font-bold text-lg tracking-tight group-hover:text-indigo-400 transition-colors">
            CineSearch
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-5 text-sm">
          <Link to="/" className={active('/')}>Inicio</Link>
          {user && (
            <Link to="/favorites" className={active('/favorites')}>
              ❤️ Favoritos
            </Link>
          )}
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-3 text-sm shrink-0">
          {user ? (
            <>
              <span className="text-gray-400 hidden sm:block">
                Hola, <span className="text-white">{user.username}</span>
              </span>
              <button
                onClick={handleLogout}
                className="border border-white/10 hover:border-white/30 text-gray-400 hover:text-white px-3 py-1.5 rounded-lg transition-all"
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-400 hover:text-white transition-colors">
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-lg transition-colors"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
