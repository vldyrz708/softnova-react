const Album = require('../../../../../models/Album')

function normalizarNumero(body, campo, parser) {
  if (body[campo] !== undefined && body[campo] !== null && body[campo] !== '') {
    body[campo] = parser(body[campo])
  }
}

function formatearFecha(fecha) {
  if (!fecha) return null
  return new Date(fecha).toISOString().split('T')[0]
}

function mapAlbumToResponse(albumObj) {
  return {
    ...albumObj,
    artistaGrupo: albumObj.artista,
    version: albumObj.versionAlbum,
    peso: albumObj.pesoGramos ? `${albumObj.pesoGramos}g` : '',
    fechaLanzamiento: formatearFecha(albumObj.fechaLanzamiento),
    fechaCompra: formatearFecha(albumObj.fechaAdquisicion),
    fechaCaducidad: formatearFecha(albumObj.fechaLimiteVenta),
  }
}

function buildFilters(query) {
  const filtros = {}
  if (query.artista) filtros.artista = { $regex: query.artista, $options: 'i' }
  if (query.categoria) filtros.categoria = { $in: query.categoria.split(',') }
  if (query.disponible === 'true') {
    filtros.stock = { $gt: 0 }
    filtros.fechaLimiteVenta = { $gte: new Date() }
  }
  if (query.precioMin || query.precioMax) {
    filtros.precio = {}
    if (query.precioMin) filtros.precio.$gte = parseFloat(query.precioMin)
    if (query.precioMax) filtros.precio.$lte = parseFloat(query.precioMax)
  }
  return filtros
}

function createAlbumRepository() {
  return {
    async list(query) {
      const page = parseInt(query.page) || 1
      const limit = parseInt(query.limit) || 10
      const skip = (page - 1) * limit
      const filtros = buildFilters(query)

      const [albums, total] = await Promise.all([
        Album.find(filtros).sort({ createdAt: -1 }).limit(limit).skip(skip),
        Album.countDocuments(filtros),
      ])

      return {
        albums: albums.map((a) => mapAlbumToResponse(a.toObject())),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      }
    },

    async getById(id) {
      return Album.findById(id)
    },

    async create(body) {
      normalizarNumero(body, 'precio', parseFloat)
      normalizarNumero(body, 'stock', parseInt)
      normalizarNumero(body, 'pesoGramos', parseFloat)
      return Album.create(body)
    },

    async update(id, body) {
      normalizarNumero(body, 'precio', parseFloat)
      normalizarNumero(body, 'stock', parseInt)
      normalizarNumero(body, 'pesoGramos', parseFloat)
      return Album.findByIdAndUpdate(id, body, { new: true, runValidators: false, context: 'query' })
    },

    async remove(id) {
      const album = await Album.findById(id)
      if (!album) return null
      const info = { id: album._id, nombreAlbum: album.nombreAlbum, artista: album.artista }
      await Album.findByIdAndDelete(id)
      return info
    },

    async search(query) {
      const { q, categoria, artista, precioMin, precioMax, disponible } = query
      const page = parseInt(query.page) || 1
      const limit = parseInt(query.limit) || 10
      const skip = (page - 1) * limit

      const filter = {}
      if (q) filter.$text = { $search: q }
      if (categoria) filter.categoria = { $in: categoria.split(',') }
      if (artista) filter.artista = { $regex: artista, $options: 'i' }
      if (disponible === 'true') {
        filter.stock = { $gt: 0 }
        filter.fechaLimiteVenta = { $gte: new Date() }
      }
      if (precioMin || precioMax) {
        filter.precio = {}
        if (precioMin) filter.precio.$gte = parseFloat(precioMin)
        if (precioMax) filter.precio.$lte = parseFloat(precioMax)
      }

      const [albums, total] = await Promise.all([
        Album.find(filter)
          .sort(q ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
          .limit(limit)
          .skip(skip),
        Album.countDocuments(filter),
      ])

      return { albums, total, page, limit, pages: Math.ceil(total / limit), searchQuery: q || 'Sin término de búsqueda' }
    },

    async byArtist(artista) {
      return Album.find({ artista: { $regex: artista, $options: 'i' } }).sort({ fechaLanzamiento: -1 })
    },

    async byCategory(categoria) {
      return Album.find({ categoria: { $in: [categoria] } }).sort({ createdAt: -1 })
    },

    async updateStock(id, cantidad) {
      const album = await Album.findByIdAndUpdate(id, { $inc: { stock: cantidad } }, { new: true, runValidators: true })
      if (!album) return null
      return { id: album._id, nombreAlbum: album.nombreAlbum, stockAnterior: album.stock - cantidad, stockActual: album.stock }
    },

    async stats() {
      const totalAlbumes = await Album.countDocuments({})
      const albumesDisponibles = await Album.countDocuments({ stock: { $gt: 0 }, fechaLimiteVenta: { $gte: new Date() } })

      const estadisticasPorCategoria = await Album.aggregate([
        { $unwind: '$categoria' },
        { $group: { _id: '$categoria', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ])

      const albumesMasCaros = await Album.find({}).sort({ precio: -1 }).limit(5).select('nombreAlbum artista precio')

      return {
        totalAlbumes,
        albumesDisponibles,
        albumesAgotados: totalAlbumes - albumesDisponibles,
        estadisticasPorCategoria,
        albumesMasCaros,
      }
    },
  }
}

module.exports = { createAlbumRepository }
