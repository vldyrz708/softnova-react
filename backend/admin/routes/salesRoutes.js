const express = require('express');
const router  = express.Router();
const salesCtrl = require('../controllers/salesController');
const { verifyToken, requireRole } = require('../../middlewares/auth');

// Reporte: solo Admin
router.get('/reporte', verifyToken, requireRole('Admin'), salesCtrl.reporte);

// CRUD: Admin puede ver y crear; cajero solo crear
router.get('/',  verifyToken, requireRole('Admin'), salesCtrl.listarVentas);
router.post('/', verifyToken, requireRole('Admin', 'Usuario'), salesCtrl.crearVenta);

module.exports = router;
