import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useFavoritesStore from '../store/favoritesStore';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const { login, error, clearError, user } = useAuthStore();
  const { loadForUser } = useFavoritesStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user]);

  useEffect(() => { clearError(); }, []);

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Requerido';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Email inválido';
    if (!form.password) e.password = 'Requerido';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    setErrors({});

    const ok = login(form.email, form.password);
    if (ok) {
      const session = useAuthStore.getState().user;
      loadForUser(session.id);
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🎬</div>
          <h1 className="text-white text-2xl font-bold">CineSearch</h1>
          <p className="text-gray-500 text-sm mt-1">Inicia sesión para continuar</p>
        </div>

        <div className="bg-gray-900 border border-white/5 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="text-gray-400 text-sm block mb-1.5">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="tu@email.com"
                className={`w-full bg-gray-800 border ${errors.email ? 'border-red-500/60' : 'border-white/10'} focus:border-indigo-500/60 text-white placeholder-gray-600 rounded-lg px-4 py-3 text-sm outline-none transition-colors`}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="text-gray-400 text-sm block mb-1.5">Contraseña</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className={`w-full bg-gray-800 border ${errors.password ? 'border-red-500/60' : 'border-white/10'} focus:border-indigo-500/60 text-white placeholder-gray-600 rounded-lg px-4 py-3 text-sm outline-none transition-colors`}
              />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-lg transition-colors mt-2"
            >
              Iniciar sesión
            </button>
          </form>

          <p className="text-gray-500 text-sm text-center mt-6">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 transition-colors">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
