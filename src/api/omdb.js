import axios from 'axios';

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_OMDB_API_URL;

const omdb = axios.create({ baseURL: BASE_URL });

/**
 * Search movies by title (paginated)
 * @param {string} query
 * @param {number} page
 */
export const searchMovies = (query, page = 1) =>
  omdb.get('/', {
    params: { apikey: API_KEY, s: query, type: 'movie', page },
  });

/**
 * Get full movie details by IMDb ID
 * @param {string} imdbId
 */
export const getMovieById = (imdbId) =>
  omdb.get('/', {
    params: { apikey: API_KEY, i: imdbId, plot: 'full' },
  });

/**
 * Search by title for a single result (used for suggestions)
 * @param {string} title
 */
export const getMovieByTitle = (title) =>
  omdb.get('/', {
    params: { apikey: API_KEY, t: title, plot: 'short' },
  });
