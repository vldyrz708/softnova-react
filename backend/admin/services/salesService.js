/**
 * Sales service — business logic and DB access for sales.
 */
const Sale = require('../../models/Sale');
const Album = require('../../models/Album');

async function listarVentas({ page = 1, limit = 20 }) {
  const safePage = Math.max(1, page);
  const safeLimit = Math.min(100, limit);
  const skip = (safePage - 1) * safeLimit;

  const [ventas, total] = await Promise.all([
    Sale.find()
      .populate('album', 'nombreAlbum artista precio')
      .populate('vendidoPor', 'nombre apellido')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit),
    Sale.countDocuments(),
  ]);

  return { ventas, total, page: safePage, pages: Math.ceil(total / safeLimit) };
}

async function crearVenta({ albumId, cantidad, notas, userId }) {
  const album = await Album.findById(albumId);
  if (!album) throw Object.assign(new Error('Álbum no encontrado'), { status: 404 });
  if (album.stock < cantidad) {
    throw Object.assign(new Error(`Stock insuficiente. Disponible: ${album.stock}`), { status: 400 });
  }

  const venta = await Sale.create({
    album: albumId,
    cantidad,
    precioUnitario: album.precio,
    total: cantidad * album.precio,
    vendidoPor: userId,
    notas,
  });

  album.stock -= cantidad;
  await album.save();

  return venta.populate([
    { path: 'album', select: 'nombreAlbum artista precio' },
    { path: 'vendidoPor', select: 'nombre apellido' },
  ]);
}

async function reporte(periodo = 'mes') {
  let groupId;
  const fechaLimite = new Date();

  if (periodo === 'dia') {
    fechaLimite.setDate(fechaLimite.getDate() - 30);
    groupId = { anio: { $year: '$createdAt' }, mes: { $month: '$createdAt' }, dia: { $dayOfMonth: '$createdAt' } };
  } else if (periodo === 'semana') {
    fechaLimite.setDate(fechaLimite.getDate() - 84);
    groupId = { anio: { $year: '$createdAt' }, semana: { $week: '$createdAt' } };
  } else if (periodo === 'anio') {
    fechaLimite.setFullYear(fechaLimite.getFullYear() - 5);
    groupId = { anio: { $year: '$createdAt' } };
  } else {
    // mes (default)
    fechaLimite.setMonth(fechaLimite.getMonth() - 12);
    groupId = { anio: { $year: '$createdAt' }, mes: { $month: '$createdAt' } };
  }

  const match = { $match: { createdAt: { $gte: fechaLimite } } };

  const [datos, resumenArr] = await Promise.all([
    Sale.aggregate([
      match,
      { $group: { _id: groupId, ventas: { $sum: 1 }, ingresos: { $sum: '$total' }, unidades: { $sum: '$cantidad' } } },
      { $sort: { '_id.anio': 1, '_id.mes': 1, '_id.dia': 1, '_id.semana': 1 } },
    ]),
    Sale.aggregate([
      match,
      { $group: { _id: null, totalVentas: { $sum: 1 }, totalIngresos: { $sum: '$total' }, totalUnidades: { $sum: '$cantidad' } } },
    ]),
  ]);

  return {
    resumen: resumenArr[0] || { totalVentas: 0, totalIngresos: 0, totalUnidades: 0 },
    datos,
  };
}

module.exports = { listarVentas, crearVenta, reporte };
