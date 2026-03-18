const { ok, fail } = require('../utils/response');
const salesUseCases = require('../src/application/usecases/sales');

// ── Listar ventas con paginación ──────────────────────────────────────────────
exports.listarVentas = async (req, res, next) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, parseInt(req.query.limit) || 20);
        const result = await salesUseCases.listSales({ page, limit });
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
        const venta = await salesUseCases.createSale({ albumId, cantidad, notas, userId });
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
        const { resumen, datos } = await salesUseCases.getSalesReport({ periodo });
        return ok(res, { periodo, resumen, datos });
    } catch (err) {
        next(err);
    }
};
