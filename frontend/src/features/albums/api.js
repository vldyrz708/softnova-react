import client from '@/api/client.js'

export const albumsApi = {
  list: (params = {}) => client.get('/api/albums', { params }),
  search: (params = {}) => client.get('/api/albums/search', { params }),
  stats: () => client.get('/api/albums/stats'),
  getById: (id) => client.get(`/api/albums/${id}`),
  create: (payload) => client.post('/api/albums', payload),
  update: (id, payload) => client.patch(`/api/albums/${id}`, payload),
  remove: (id) => client.delete(`/api/albums/${id}`),
}
