import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { usersApi } from './api.js'

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await usersApi.list()
      return data
    },
  })
}

export const useCreateUser = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload) => usersApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  })
}

export const useUpdateUser = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }) => usersApi.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  })
}

export const useDeleteUser = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => usersApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  })
}
