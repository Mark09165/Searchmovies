import { useState } from 'react';
import useAuthStore from '../store/authStore';
import useReviewsStore from '../store/reviewsStore';

export default function ReviewSection({ imdbID }) {
  const { user } = useAuthStore();
  const { reviews, addReview, editReview, deleteReview } = useReviewsStore();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ rating: 7, content: '' });
  const [error, setError] = useState('');

  const userReview = reviews.find((r) => r.userId === user?.id);

  const openNew = () => {
    setEditingId(null);
    setForm({ rating: 7, content: '' });
    setError('');
    setShowForm(true);
  };

  const openEdit = (review) => {
    setEditingId(review.id);
    setForm({ rating: review.rating, content: review.content });
    setError('');
    setShowForm(true);
  };

  const cancel = () => {
    setShowForm(false);
    setEditingId(null);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.content.trim()) {
      setError('Escribe algo en tu reseña');
      return;
    }

    if (editingId) {
      editReview(imdbID, editingId, { rating: form.rating, content: form.content });
    } else {
      const ok = addReview(imdbID, {
        userId: user.id,
        username: user.username,
        rating: form.rating,
        content: form.content,
      });
      if (!ok) {
        setError('Ya tienes una reseña para esta película');
        return;
      }
    }

    cancel();
  };

  const handleDelete = (reviewId) => {
    if (!confirm('¿Eliminar esta reseña?')) return;
    deleteReview(imdbID, reviewId);
  };

  return (
    <section className="mt-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-xl font-semibold">
          Reseñas{' '}
          <span className="text-gray-500 text-base font-normal">({reviews.length})</span>
        </h2>
        {user && !userReview && !showForm && (
          <button
            onClick={openNew}
            className="text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-colors"
          >
            + Escribir reseña
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && user && (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800/50 border border-white/10 rounded-xl p-5 mb-6"
        >
          <h3 className="text-white font-medium mb-4">
            {editingId ? 'Editar reseña' : 'Nueva reseña'}
          </h3>

          {/* Rating slider */}
          <div className="mb-4">
            <label className="text-gray-400 text-sm block mb-2">
              Calificación:{' '}
              <span className="text-white font-semibold">{form.rating}/10</span>
            </label>
            <input
              type="range"
              min={1}
              max={10}
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
              className="w-full accent-indigo-500"
            />
            <div className="flex justify-between text-gray-600 text-xs mt-1">
              <span>1</span><span>10</span>
            </div>
          </div>

          {/* Text */}
          <div className="mb-4">
            <label className="text-gray-400 text-sm block mb-2">Tu reseña</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="¿Qué te pareció la película?"
              rows={4}
              maxLength={1000}
              className="w-full bg-gray-900 border border-white/10 focus:border-indigo-500/60 text-white placeholder-gray-600 rounded-lg px-4 py-3 text-sm outline-none resize-none transition-colors"
            />
            <p className="text-gray-600 text-xs text-right mt-1">{form.content.length}/1000</p>
          </div>

          {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={!form.content.trim()}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2 rounded-lg text-sm transition-colors"
            >
              {editingId ? 'Actualizar' : 'Publicar'}
            </button>
            <button
              type="button"
              onClick={cancel}
              className="border border-white/10 hover:border-white/30 text-gray-400 hover:text-white px-5 py-2 rounded-lg text-sm transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* List */}
      {reviews.length === 0 ? (
        <div className="text-center py-10 text-gray-600">
          <p className="text-4xl mb-2">💬</p>
          <p>Sé el primero en reseñar esta película</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-gray-800/40 border border-white/5 rounded-xl p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-600/20 flex items-center justify-center text-indigo-400 font-bold text-sm shrink-0">
                    {review.username?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{review.username}</p>
                    <p className="text-gray-500 text-xs">
                      {new Date(review.createdAt).toLocaleDateString('es-MX', {
                        year: 'numeric', month: 'short', day: 'numeric',
                      })}
                      {review.updatedAt !== review.createdAt && ' · editada'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="bg-yellow-500/15 text-yellow-400 text-sm font-bold px-2.5 py-0.5 rounded-full">
                    ★ {review.rating}/10
                  </span>
                  {user?.id === review.userId && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => openEdit(review)}
                        className="text-gray-500 hover:text-indigo-400 text-xs px-2 py-1 rounded transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="text-gray-500 hover:text-red-400 text-xs px-2 py-1 rounded transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-gray-300 text-sm mt-3 leading-relaxed">{review.content}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
