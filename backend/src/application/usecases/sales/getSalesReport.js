async function getSalesReport({ periodo }, { salesRepository }) {
  return salesRepository.report(periodo)
}

module.exports = { getSalesReport }
