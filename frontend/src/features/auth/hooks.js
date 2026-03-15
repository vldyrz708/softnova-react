import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'

import { authApi } from './api.js'
import useAuthStore, { selectIsAuthenticated } from './store.js'

const useAuthSession = () => {
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const setUser = useAuthStore((state) => state.setUser)
  const clearSession = useAuthStore((state) => state.clearSession)

  const query = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const { data } = await authApi.profile()
      setUser(data.user)
      return data.user
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
    retry: false,
  })

  useEffect(() => {
    if (query.isError) {
      clearSession()
    }
  }, [query.isError, clearSession])

  return query
}

export default useAuthSession
