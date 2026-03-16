/**
 * Global auth store.
 * Single source of truth for authentication state — persisted to localStorage.
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const computeIsAuthenticated = (token, expiresAt) => {
  if (!token) return false
  if (!expiresAt) return true
  return expiresAt > Date.now()
}

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      expiresAt: null,
      setCredentials: ({ token, user, expiresIn }) => {
        const expiresAt = expiresIn ? Date.now() + expiresIn * 1000 : null
        set({ token, user, expiresAt })
      },
      setUser: (user) => set({ user }),
      clearSession: () => set({ token: null, user: null, expiresAt: null }),
    }),
    {
      name: 'softnova-auth',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        expiresAt: state.expiresAt,
      }),
    },
  ),
)

export const selectAuthUser = (state) => state.user
export const selectIsAuthenticated = (state) => computeIsAuthenticated(state.token, state.expiresAt)

export default useAuthStore
