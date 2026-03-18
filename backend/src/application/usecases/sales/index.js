const { createSalesRepository } = require('../../../infrastructure/db/mongoose/repositories/salesRepository')
const { listSales } = require('./listSales')
const { createSale } = require('./createSale')
const { getSalesReport } = require('./getSalesReport')

const salesRepository = createSalesRepository()

module.exports = {
  listSales: (input) => listSales(input, { salesRepository }),
  createSale: (input) => createSale(input, { salesRepository }),
  getSalesReport: (input) => getSalesReport(input, { salesRepository }),
}
