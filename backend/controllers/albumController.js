const { ok, fail } = require('../utils/response');
const albumUseCases = require('../src/application/usecases/albums');

// @desc    Obtener todos los álbumes con paginación y filtros
// @route   GET /api/albums
// @access  Public
const obtenerAlbumes = async (req, res, next) => {
    try {
        const result = await albumUseCases.listAlbums(req.query);
        return ok(res, result);
    } catch (error) {
        next(error);
    }
};

// @desc    Obtener un álbum por ID
// @route   GET /api/albums/:id
// @access  Public
const obtenerAlbumPorId = async (req, res, next) => {
    try {
        const album = await albumUseCases.getAlbumById({ id: req.params.id });
        if (!album) return fail(res, 'Álbum no encontrado', 404);
        return ok(res, { data: album });
    } catch (error) {
        next(error);
    }
};

// @desc    Crear un nuevo álbum
// @route   POST /api/albums
// @access  Private
const crearAlbum = async (req, res, next) => {
    try {
        const album = await albumUseCases.createAlbum({ body: req.body });
        return ok(res, { message: 'Álbum creado exitosamente', data: album }, 201);
    } catch (error) {
        next(error);
    }
};

// @desc    Actualizar un álbum
// @route   PUT /api/albums/:id o PATCH /api/albums/:id
// @access  Private
const actualizarAlbum = async (req, res, next) => {
    try {
        const album = await albumUseCases.updateAlbum({ id: req.params.id, body: req.body });
        if (!album) return fail(res, 'Álbum no encontrado', 404);
        return ok(res, { message: 'Álbum actualizado exitosamente', data: album });
    } catch (error) {
        next(error);
    }
};

// @desc    Eliminar un álbum permanentemente
// @route   DELETE /api/albums/:id
// @access  Private
const eliminarAlbum = async (req, res, next) => {
    try {
        const info = await albumUseCases.deleteAlbum({ id: req.params.id });
        if (!info) return fail(res, 'Álbum no encontrado', 404);
        return ok(res, { message: 'Álbum eliminado permanentemente', data: info });
    } catch (error) {
        next(error);
    }
};

// @desc    Búsqueda de álbumes por texto
// @route   GET /api/albums/search
// @access  Public
const buscarAlbumes = async (req, res, next) => {
    try {
        const result = await albumUseCases.searchAlbums(req.query);
        return ok(res, { data: result.albums, pagination: { page: result.page, limit: result.limit, total: result.total, pages: result.pages }, searchQuery: result.searchQuery });
    } catch (error) {
        next(error);
    }
};

// @desc    Obtener álbumes por artista
// @route   GET /api/albums/artista/:artista
// @access  Public
const obtenerAlbumesPorArtista = async (req, res, next) => {
    try {
        const albums = await albumUseCases.getAlbumsByArtist({ artista: req.params.artista });
        return ok(res, { data: albums, count: albums.length, artista: req.params.artista });
    } catch (error) {
        next(error);
    }
};

// @desc    Obtener álbumes por categoría
// @route   GET /api/albums/categoria/:categoria
// @access  Public
const obtenerAlbumesPorCategoria = async (req, res, next) => {
    try {
        const albums = await albumUseCases.getAlbumsByCategory({ categoria: req.params.categoria });
        return ok(res, { data: albums, count: albums.length, categoria: req.params.categoria });
    } catch (error) {
        next(error);
    }
};

// @desc    Actualizar stock de un álbum
// @route   PATCH /api/albums/:id/stock
// @access  Private
const actualizarStock = async (req, res, next) => {
    try {
        const { cantidad } = req.body;
        if (typeof cantidad !== 'number') return fail(res, 'La cantidad debe ser un número');

        const info = await albumUseCases.updateAlbumStock({ id: req.params.id, cantidad });
        if (!info) return fail(res, 'Álbum no encontrado', 404);
        return ok(res, { message: 'Stock actualizado exitosamente', data: info });
    } catch (error) {
        next(error);
    }
};

// @desc    Obtener estadísticas de álbumes
// @route   GET /api/albums/stats
// @access  Public
const obtenerEstadisticas = async (req, res, next) => {
    try {
        const data = await albumUseCases.getAlbumStats();
        return ok(res, { data });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    obtenerAlbumes,
    obtenerAlbumPorId,
    crearAlbum,
    actualizarAlbum,
    eliminarAlbum,
    buscarAlbumes,
    obtenerAlbumesPorArtista,
    obtenerAlbumesPorCategoria,
    actualizarStock,
    obtenerEstadisticas
};