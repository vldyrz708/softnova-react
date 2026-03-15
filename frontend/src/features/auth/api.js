import client from '@/api/client.js'

export const authApi = {
  login: (payload) => client.post('/api/auth/login', payload),
  logout: () => client.post('/api/auth/logout'),
  profile: () => client.get('/api/auth/me'),
  register: (payload) => client.post('/api/auth/register', payload),
}
