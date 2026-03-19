import client from '@/api/client.js'

export const usersApi = {
  list: () => client.get('/api/users'),
  getById: (id) => client.get(`/api/users/${id}`),
  create: (payload) => client.post('/api/users', payload),
  update: (id, payload) => client.patch(`/api/users/${id}`, payload),
  remove: (id) => client.delete(`/api/users/${id}`),
}
