import { create } from 'zustand';

// ---------------------------------------------------------------------------
// Auth store — users are stored in localStorage (no backend)
// ---------------------------------------------------------------------------

const USERS_KEY = 'cinesearch_users';
const SESSION_KEY = 'cinesearch_session';

// Demo account — credentials loaded from environment variables (never hardcoded)
const DEMO_USER = {
  id: 'demo-001',
  username: 'MarcoA',
  email: import.meta.env.VITE_DEMO_EMAIL || '',
  password: import.meta.env.VITE_DEMO_PASSWORD || '',
};

const getUsers = () => JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
const saveUsers = (users) => localStorage.setItem(USERS_KEY, JSON.stringify(users));
const getSession = () => JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
const saveSession = (user) => localStorage.setItem(SESSION_KEY, JSON.stringify(user));
const clearSession = () => localStorage.removeItem(SESSION_KEY);

const useAuthStore = create((set) => ({
  user: getSession(),
  error: null,

  register: (username, email, password) => {
    const users = getUsers();

    if (users.find((u) => u.email === email)) {
      set({ error: 'El email ya está registrado' });
      return false;
    }
    if (users.find((u) => u.username === username)) {
      set({ error: 'El nombre de usuario ya existe' });
      return false;
    }

    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      // In a real app passwords must be hashed — this is localStorage-only demo
      password,
      createdAt: new Date().toISOString(),
    };

    saveUsers([...users, newUser]);
    const session = { id: newUser.id, username: newUser.username, email: newUser.email };
    saveSession(session);
    set({ user: session, error: null });
    return true;
  },

  login: (email, password) => {
    // Check demo account first — works on any device without registration
    if (email === DEMO_USER.email && password === DEMO_USER.password) {
      const session = { id: DEMO_USER.id, username: DEMO_USER.username, email: DEMO_USER.email };
      saveSession(session);
      set({ user: session, error: null });
      return true;
    }

    // Check locally registered users
    const users = getUsers();
    const found = users.find((u) => u.email === email && u.password === password);

    if (!found) {
      set({ error: 'Credenciales incorrectas' });
      return false;
    }

    const session = { id: found.id, username: found.username, email: found.email };
    saveSession(session);
    set({ user: session, error: null });
    return true;
  },

  logout: () => {
    clearSession();
    set({ user: null });
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
