import { create } from 'zustand';

// ---------------------------------------------------------------------------
// Reviews store — persisted in localStorage, keyed by imdbID
// ---------------------------------------------------------------------------

const REVIEWS_KEY = 'cinesearch_reviews';

const getAllReviews = () =>
  JSON.parse(localStorage.getItem(REVIEWS_KEY) || '{}');

const saveAllReviews = (data) =>
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(data));

const useReviewsStore = create((set, get) => ({
  // reviews for the currently viewed movie
  reviews: [],

  loadReviews: (imdbID) => {
    const all = getAllReviews();
    set({ reviews: all[imdbID] || [] });
  },

  addReview: (imdbID, review) => {
    const all = getAllReviews();
    const movieReviews = all[imdbID] || [];

    // One review per user per movie
    if (movieReviews.find((r) => r.userId === review.userId)) return false;

    const newReview = {
      id: Date.now().toString(),
      ...review,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newReview, ...movieReviews];
    all[imdbID] = updated;
    saveAllReviews(all);
    set({ reviews: updated });
    return true;
  },

  editReview: (imdbID, reviewId, changes) => {
    const all = getAllReviews();
    const movieReviews = (all[imdbID] || []).map((r) =>
      r.id === reviewId
        ? { ...r, ...changes, updatedAt: new Date().toISOString() }
        : r
    );
    all[imdbID] = movieReviews;
    saveAllReviews(all);
    set({ reviews: movieReviews });
  },

  deleteReview: (imdbID, reviewId) => {
    const all = getAllReviews();
    const movieReviews = (all[imdbID] || []).filter((r) => r.id !== reviewId);
    all[imdbID] = movieReviews;
    saveAllReviews(all);
    set({ reviews: movieReviews });
  },
}));

export default useReviewsStore;
