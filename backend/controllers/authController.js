const { normalizarCorreo, validarDatosRegistro, loginUser, registerUser, getMe } = require('../services/authService');
const { COOKIE_NAME, COOKIE_OPTIONS } = require('../utils/jwt');
const { ok, fail } = require('../utils/response');
const User = require('../models/User');

async function login(req, res, next) {
    try {
        const { correo, password } = req.body;
        if (!correo || !password) return fail(res, 'Correo y contraseña son requeridos');

        const correoNormalizado = normalizarCorreo(correo);
        const result = await loginUser(correoNormalizado, password);
        res.cookie(result.cookieName, result.token, result.cookieOptions);
        return ok(res, { token: result.token, user: result.user, expiresIn: result.expiresIn });
    } catch (err) {
        if (err.status) return fail(res, err.message, err.status);
        next(err);
    }
}

function logout(_req, res) {
    res.clearCookie(COOKIE_NAME, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
    return ok(res, { message: 'Sesión cerrada' });
}

async function register(req, res, next) {
    try {
        const payload = {
            nombre: (req.body.nombre || '').trim(),
            apellido: (req.body.apellido || '').trim(),
            edad: req.body.edad,
            numeroTelefono: (req.body.numeroTelefono || '').trim(),
            correo: normalizarCorreo(req.body.correo),
            password: req.body.contrasena || req.body.password
        };

        const error = validarDatosRegistro(payload);
        if (error) return fail(res, error);

        const correoExistente = await User.findOne({ correo: payload.correo });
        if (correoExistente) return fail(res, 'El correo ya está registrado', 409);

        const user = await registerUser(payload);
        return ok(res, { message: 'Registro exitoso', user }, 201);
    } catch (err) {
        if (err.code === 11000 && err.keyPattern?.correo) return fail(res, 'El correo ya está registrado', 409);
        if (err.name === 'ValidationError') {
            const mensaje = Object.values(err.errors)[0]?.message || 'Datos inválidos';
            return fail(res, mensaje);
        }
        next(err);
    }
}

async function me(req, res, next) {
    try {
        const user = await getMe(req.user.id);
        if (!user) return fail(res, 'Usuario no encontrado', 404);
        return ok(res, { user });
    } catch (err) {
        next(err);
    }
}

module.exports = { login, logout, me, register };
