async function listSales({ page, limit }, { salesRepository }) {
  return salesRepository.list({ page, limit })
}

module.exports = { listSales }
