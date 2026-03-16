/**
 * User service — business logic for user management.
 */
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const EDAD_MIN = 16;
const EDAD_MAX = 99;

/**
 * Validate age value.
 * @returns {string|null} error message, or null when valid
 */
function validarEdad(edad) {
  if (edad === undefined || edad === null || edad === '') return 'La edad es requerida';
  const n = Number(edad);
  if (!Number.isInteger(n)) return 'La edad debe ser un número entero';
  if (n < EDAD_MIN || n > EDAD_MAX) return `La edad debe estar entre ${EDAD_MIN} y ${EDAD_MAX} años`;
  return null;
}

/**
 * Hash a plain-text password.
 * @param {string} plain
 * @returns {Promise<string>}
 */
async function hashPassword(plain) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
}

async function crearUsuario({ nombre, apellido, edad, numeroTelefono, rol, correo, password }) {
  const nuevo = new User({ nombre, apellido, edad: Number(edad), numeroTelefono, rol, correo, password });
  const guardado = await nuevo.save();
  const obj = guardado.toObject();
  delete obj.password;
  return obj;
}

async function obtenerUsuarios() {
  return User.find().select('-password').sort({ createdAt: -1 });
}

async function obtenerUsuarioPorId(id) {
  return User.findById(id).select('-password');
}

/**
 * Apply partial updates to a user, including optional password re-hash.
 */
async function actualizarUsuario(id, cambios) {
  const data = { ...cambios };
  const plain = data.contrasena || data.password;
  if (plain) {
    data.password = await hashPassword(plain);
    delete data.contrasena;
  } else {
    delete data.password;
    delete data.contrasena;
  }
  return User.findByIdAndUpdate(id, data, { new: true, runValidators: true }).select('-password');
}

async function eliminarUsuario(id) {
  return User.findByIdAndDelete(id);
}

module.exports = { validarEdad, hashPassword, crearUsuario, obtenerUsuarios, obtenerUsuarioPorId, actualizarUsuario, eliminarUsuario };
