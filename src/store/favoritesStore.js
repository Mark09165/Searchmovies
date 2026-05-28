import { create } from 'zustand';

// ---------------------------------------------------------------------------
// Favorites store — persisted in localStorage per user
// ---------------------------------------------------------------------------

const getKey = (userId) => `cinesearch_favorites_${userId}`;

const loadFavorites = (userId) => {
  if (!userId) return [];
  return JSON.parse(localStorage.getItem(getKey(userId)) || '[]');
};

const saveFavorites = (userId, favorites) => {
  localStorage.setItem(getKey(userId), JSON.stringify(favorites));
};

const useFavoritesStore = create((set, get) => ({
  favorites: [],

  // Call this after login / on app load when user is known
  loadForUser: (userId) => {
    set({ favorites: loadFavorites(userId) });
  },

  addFavorite: (userId, movie) => {
    const current = get().favorites;
    if (current.find((f) => f.imdbID === movie.imdbID)) return;
    const updated = [movie, ...current];
    saveFavorites(userId, updated);
    set({ favorites: updated });
  },

  removeFavorite: (userId, imdbID) => {
    const updated = get().favorites.filter((f) => f.imdbID !== imdbID);
    saveFavorites(userId, updated);
    set({ favorites: updated });
  },

  isFavorite: (imdbID) => get().favorites.some((f) => f.imdbID === imdbID),

  clearFavorites: () => set({ favorites: [] }),
}));

export default useFavoritesStore;
