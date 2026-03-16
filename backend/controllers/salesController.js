const { ok, fail } = require('../utils/response');
const salesService = require('../services/salesService');

// ── Listar ventas con paginación ──────────────────────────────────────────────
exports.listarVentas = async (req, res, next) => {
    try {
        const page  = parseInt(req.query.page)  || 1;
        const limit = parseInt(req.query.limit) || 20;
        const result = await salesService.listarVentas({ page, limit });
        return ok(res, result);
    } catch (err) {
        next(err);
    }
};

// ── Crear venta ───────────────────────────────────────────────────────────────
exports.crearVenta = async (req, res, next) => {
    try {
        const { albumId, cantidad, notas } = req.body;
        const userId = req.user.id || req.user._id;
        const venta = await salesService.crearVenta({ albumId, cantidad, notas, userId });
        return ok(res, { venta }, 201);
    } catch (err) {
        if (err.status) return fail(res, err.message, err.status);
        next(err);
    }
};

// ── Reporte agregado ──────────────────────────────────────────────────────────
exports.reporte = async (req, res, next) => {
    try {
        const periodo = req.query.periodo || 'mes';
        const { resumen, datos } = await salesService.reporte(periodo);
        return ok(res, { periodo, resumen, datos });
    } catch (err) {
        next(err);
    }
};

// ── Listar ventas con paginación ──────────────────────────────────────────────
exports.listarVentas = async (req, res, next) => {
    try {
        const page  = Math.max(1, parseInt(req.query.page)  || 1);
        const limit = Math.min(100, parseInt(req.query.limit) || 20);
        const skip  = (page - 1) * limit;

        const [ventas, total] = await Promise.all([
            Sale.find()
                .populate('album', 'nombreAlbum artista precio')
                .populate('vendidoPor', 'nombre apellido')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Sale.countDocuments()
        ]);

        res.json({ ok: true, total, page, pages: Math.ceil(total / limit), ventas });
    } catch (err) {
        next(err);
    }
};

// ── Crear venta ───────────────────────────────────────────────────────────────
exports.crearVenta = async (req, res, next) => {
    try {
        const { albumId, cantidad, notas } = req.body;

        const album = await Album.findById(albumId);
        if (!album) return res.status(404).json({ ok: false, mensaje: 'Álbum no encontrado' });
        if (album.stock < cantidad) {
            return res.status(400).json({ ok: false, mensaje: `Stock insuficiente. Disponible: ${album.stock}` });
        }

        const venta = await Sale.create({
            album:          albumId,
            cantidad,
            precioUnitario: album.precio,
            total:          cantidad * album.precio,
            vendidoPor:     req.user.id || req.user._id,
            notas
        });

        // Descontar stock
        album.stock -= cantidad;
        await album.save();

        const ventaPopulada = await venta.populate([
            { path: 'album',      select: 'nombreAlbum artista precio' },
            { path: 'vendidoPor', select: 'nombre apellido' }
        ]);

        res.status(201).json({ ok: true, venta: ventaPopulada });
    } catch (err) {
        next(err);
    }
};

// ── Reporte agregado ──────────────────────────────────────────────────────────
exports.reporte = async (req, res, next) => {
    try {
        const periodo = req.query.periodo || 'mes'; // dia | semana | mes | anio

        let groupId;
        let fechaLimite = new Date();

        if (periodo === 'dia') {
            // Últimos 30 días agrupados por día
            fechaLimite.setDate(fechaLimite.getDate() - 30);
            groupId = {
                anio: { $year: '$createdAt' },
                mes:  { $month: '$createdAt' },
                dia:  { $dayOfMonth: '$createdAt' }
            };
        } else if (periodo === 'semana') {
            // Últimas 12 semanas agrupadas por semana del año
            fechaLimite.setDate(fechaLimite.getDate() - 84);
            groupId = {
                anio:   { $year: '$createdAt' },
                semana: { $week: '$createdAt' }
            };
        } else if (periodo === 'anio') {
            // Últimos 5 años agrupados por año
            fechaLimite.setFullYear(fechaLimite.getFullYear() - 5);
            groupId = { anio: { $year: '$createdAt' } };
        } else {
            // mes (default): últimos 12 meses
            fechaLimite.setMonth(fechaLimite.getMonth() - 12);
            groupId = {
                anio: { $year: '$createdAt' },
                mes:  { $month: '$createdAt' }
            };
        }

        const datos = await Sale.aggregate([
            { $match: { createdAt: { $gte: fechaLimite } } },
            {
                $group: {
                    _id:       groupId,
                    ventas:    { $sum: 1 },
                    ingresos:  { $sum: '$total' },
                    unidades:  { $sum: '$cantidad' }
                }
            },
            { $sort: { '_id.anio': 1, '_id.mes': 1, '_id.dia': 1, '_id.semana': 1 } }
        ]);

        // Totales generales del mismo rango
        const [resumen] = await Sale.aggregate([
            { $match: { createdAt: { $gte: fechaLimite } } },
            {
                $group: {
                    _id:            null,
                    totalVentas:    { $sum: 1 },
                    totalIngresos:  { $sum: '$total' },
                    totalUnidades:  { $sum: '$cantidad' }
                }
            }
        ]);

        res.json({
            ok: true,
            periodo,
            resumen: resumen || { totalVentas: 0, totalIngresos: 0, totalUnidades: 0 },
            datos
        });
    } catch (err) {
        next(err);
    }
};
