import { useMemo } from 'react'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { albumsApi } from './api.js'

const DEFAULT_PAGINATION = {
  page: 1,
  limit: 10,
}

export const useAlbums = (filters = {}) => {
  const params = useMemo(() => ({
    ...DEFAULT_PAGINATION,
    ...filters,
  }), [filters])

  return useQuery({
    queryKey: ['albums', params],
    queryFn: async () => {
      const { data } = await albumsApi.list(params)
      return data
    },
    placeholderData: keepPreviousData,
  })
}

export const useAlbumStats = () => {
  return useQuery({
    queryKey: ['albums', 'stats'],
    queryFn: async () => {
      const { data } = await albumsApi.stats()
      return data
    },
    staleTime: 1000 * 60 * 10,
  })
}

export const useCreateAlbum = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload) => albumsApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['albums'] }),
  })
}

export const useUpdateAlbum = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }) => albumsApi.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['albums'] }),
  })
}

export const useDeleteAlbum = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => albumsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['albums'] }),
  })
}
