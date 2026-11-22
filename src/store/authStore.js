import { createContext, useContext } from 'react';
import { createStore, useStore } from 'zustand';
import { persist } from 'zustand/middleware';

export const AuthStoreContext = createContext(null);

export const createAuthStore = () => createStore(
  persist(
    (set, get, api) => ({
      token: null,
      username: null,
      login: ({ token, username }) => set({ token, username }),
      logout: () => {
        set({ token: null, username: null });
        api.persist.clearStorage();
      },
    }),
    {
      name: 'auth',
      partialize: ({ token, username }) => ({ token, username }),
    },
  ),
);

const useAuthStore = (selector) => {
  const store = useContext(AuthStoreContext);

  if (!store) {
    throw new Error('useAuthStore must be used within AuthStoreContext.Provider');
  }

  return useStore(store, selector);
};

export default useAuthStore;
