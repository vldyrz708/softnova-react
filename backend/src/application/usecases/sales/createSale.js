async function createSale({ albumId, cantidad, notas, userId }, { salesRepository }) {
  return salesRepository.create({ albumId, cantidad, notas, userId })
}

module.exports = { createSale }
