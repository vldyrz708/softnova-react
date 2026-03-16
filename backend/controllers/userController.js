const { ok, fail } = require('../utils/response');
const {
    validarEdad,
    crearUsuario,
    obtenerUsuarios,
    obtenerUsuarioPorId,
    actualizarUsuario,
    eliminarUsuario,
} = require('../services/userService');

async function crearUsuarioCtrl(req, res, next) {
    try {
        const { nombre, apellido, edad, numeroTelefono, rol, correo } = req.body;
        const errorEdad = validarEdad(edad);
        if (errorEdad) return fail(res, errorEdad);

        const password = req.body.contrasena || req.body.password;
        if (!password) return fail(res, 'La contraseña es requerida');

        const user = await crearUsuario({ nombre, apellido, edad, numeroTelefono, rol, correo, password });
        return ok(res, { user }, 201);
    } catch (error) {
        next(error);
    }
}

async function obtenerUsuariosCtrl(req, res, next) {
    try {
        const users = await obtenerUsuarios();
        return ok(res, { users });
    } catch (error) {
        next(error);
    }
}

async function obtenerUsuarioPorIdCtrl(req, res, next) {
    try {
        const user = await obtenerUsuarioPorId(req.params.id);
        if (!user) return fail(res, 'Usuario no encontrado', 404);
        return ok(res, { user });
    } catch (error) {
        next(error);
    }
}

async function actualizarUsuarioCtrl(req, res, next) {
    try {
        const cambios = { ...req.body };

        if (cambios.edad !== undefined) {
            const errorEdad = validarEdad(cambios.edad);
            if (errorEdad) return fail(res, errorEdad);
            cambios.edad = Number(cambios.edad);
        }

        const user = await actualizarUsuario(req.params.id, cambios);
        if (!user) return fail(res, 'Usuario no encontrado', 404);
        return ok(res, { user });
    } catch (error) {
        next(error);
    }
}

async function eliminarUsuarioCtrl(req, res, next) {
    try {
        const eliminado = await eliminarUsuario(req.params.id);
        if (!eliminado) return fail(res, 'Usuario no encontrado', 404);
        return ok(res, { message: 'Usuario eliminado' });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    crearUsuario: crearUsuarioCtrl,
    obtenerUsuarios: obtenerUsuariosCtrl,
    obtenerUsuarioPorId: obtenerUsuarioPorIdCtrl,
    actualizarUsuario: actualizarUsuarioCtrl,
    eliminarUsuario: eliminarUsuarioCtrl,
};
