import client from '@/api/client.js'

export const getSalesReport = (periodo = 'mes') =>
  client.get(`/sales/reporte?periodo=${periodo}`).then((r) => r.data)

export const getSales = (page = 1) =>
  client.get(`/sales?page=${page}`).then((r) => r.data)

export const createSale = (data) =>
  client.post('/sales', data).then((r) => r.data)
