const { ok, fail } = require('../utils/response');
const userUseCases = require('../src/application/usecases/users');

async function crearUsuarioCtrl(req, res, next) {
    try {
        const { nombre, apellido, edad, numeroTelefono, rol, correo } = req.body;
        const password = req.body.contrasena || req.body.password;
        const user = await userUseCases.createUser({ nombre, apellido, edad, numeroTelefono, rol, correo, password });
        return ok(res, { user }, 201);
    } catch (error) {
        if (error.status) return fail(res, error.message, error.status);
        next(error);
    }
}

async function obtenerUsuariosCtrl(req, res, next) {
    try {
        const users = await userUseCases.listUsers();
        return ok(res, { users });
    } catch (error) {
        next(error);
    }
}

async function obtenerUsuarioPorIdCtrl(req, res, next) {
    try {
        const user = await userUseCases.getUserById({ id: req.params.id });
        if (!user) return fail(res, 'Usuario no encontrado', 404);
        return ok(res, { user });
    } catch (error) {
        next(error);
    }
}

async function actualizarUsuarioCtrl(req, res, next) {
    try {
        const cambios = { ...req.body };
        const user = await userUseCases.updateUser({ id: req.params.id, cambios });
        if (!user) return fail(res, 'Usuario no encontrado', 404);
        return ok(res, { user });
    } catch (error) {
        if (error.status) return fail(res, error.message, error.status);
        next(error);
    }
}

async function eliminarUsuarioCtrl(req, res, next) {
    try {
        const eliminado = await userUseCases.deleteUser({ id: req.params.id });
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
