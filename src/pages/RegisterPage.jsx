import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useFavoritesStore from '../store/favoritesStore';

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const { register, error, clearError, user } = useAuthStore();
  const { loadForUser } = useFavoritesStore();
  const navigate = useNavigate();

  useEffect(() => { if (user) navigate('/'); }, [user]);
  useEffect(() => { clearError(); }, []);

  const validate = () => {
    const e = {};
    if (!form.username || form.username.length < 3)
      e.username = 'Mínimo 3 caracteres';
    if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email))
      e.email = 'Email inválido';
    if (!form.password || form.password.length < 6)
      e.password = 'Mínimo 6 caracteres';
    if (form.password !== form.confirm)
      e.confirm = 'Las contraseñas no coinciden';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    setErrors({});

    const ok = register(form.username, form.email, form.password);
    if (ok) {
      const session = useAuthStore.getState().user;
      loadForUser(session.id);
      navigate('/');
    }
  };

  const field = (key, label, type = 'text', placeholder = '') => (
    <div>
      <label className="text-gray-400 text-sm block mb-1.5">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        placeholder={placeholder}
        className={`w-full bg-gray-800 border ${errors[key] ? 'border-red-500/60' : 'border-white/10'} focus:border-indigo-500/60 text-white placeholder-gray-600 rounded-lg px-4 py-3 text-sm outline-none transition-colors`}
      />
      {errors[key] && <p className="text-red-400 text-xs mt-1">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🎬</div>
          <h1 className="text-white text-2xl font-bold">CineSearch</h1>
          <p className="text-gray-500 text-sm mt-1">Crea tu cuenta gratis</p>
        </div>

        <div className="bg-gray-900 border border-white/5 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            {field('username', 'Nombre de usuario', 'text', 'cinefilo123')}
            {field('email', 'Email', 'email', 'tu@email.com')}
            {field('password', 'Contraseña', 'password', '••••••••')}
            {field('confirm', 'Confirmar contraseña', 'password', '••••••••')}

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-lg transition-colors mt-2"
            >
              Crear cuenta
            </button>
          </form>

          <p className="text-gray-500 text-sm text-center mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
