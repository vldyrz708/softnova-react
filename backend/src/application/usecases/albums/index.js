const { createAlbumRepository } = require('../../../infrastructure/db/mongoose/repositories/albumRepository')

const albumRepository = createAlbumRepository()

module.exports = {
  listAlbums: (query) => albumRepository.list(query || {}),
  getAlbumById: ({ id }) => albumRepository.getById(id),
  createAlbum: ({ body }) => albumRepository.create(body),
  updateAlbum: ({ id, body }) => albumRepository.update(id, body),
  deleteAlbum: ({ id }) => albumRepository.remove(id),
  searchAlbums: (query) => albumRepository.search(query || {}),
  getAlbumsByArtist: ({ artista }) => albumRepository.byArtist(artista),
  getAlbumsByCategory: ({ categoria }) => albumRepository.byCategory(categoria),
  updateAlbumStock: ({ id, cantidad }) => albumRepository.updateStock(id, cantidad),
  getAlbumStats: () => albumRepository.stats(),
}
