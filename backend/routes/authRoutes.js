const express = require('express');
const router = express.Router();
const { login, logout, me, register } = require('../controllers/authController');
const { verifyToken } = require('../middlewares/auth');

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/logout
router.post('/logout', logout);

// GET /api/auth/me  — requires valid token
router.get('/me', verifyToken, me);

module.exports = router;
