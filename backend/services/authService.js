/**
 * Auth service — business logic for authentication.
 * Controllers call these functions and only handle HTTP I/O.
 */
const validator = require('validator');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { sign, COOKIE_NAME, COOKIE_OPTIONS, SESSION_TTL_SECONDS } = require('../utils/jwt');

const NAME_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/;
const PHONE_REGEX = /^\d{7,15}$/;
const EDAD_MIN = 16;
const EDAD_MAX = 99;

/**
 * Normalize an email: trim whitespace and lowercase.
 * @param {string} correo
 * @returns {string}
 */
function normalizarCorreo(correo = '') {
  return correo.trim().toLowerCase();
}

/**
 * Validate registration payload.
 * @returns {string|null} error message, or null when valid
 */
function validarDatosRegistro({ nombre, apellido, edad, numeroTelefono, correo, password }) {
  if (!nombre || !NAME_REGEX.test(nombre)) return 'El nombre sólo puede contener letras y espacios';
  if (!apellido || !NAME_REGEX.test(apellido)) return 'El apellido sólo puede contener letras y espacios';

  if (edad === undefined || edad === null || edad === '') return 'La edad es requerida';
  if (!Number.isInteger(Number(edad))) return 'La edad debe ser un número entero';
  const edadNum = Number(edad);
  if (edadNum < EDAD_MIN || edadNum > EDAD_MAX) {
    return `La edad debe estar entre ${EDAD_MIN} y ${EDAD_MAX} años`;
  }

  if (!numeroTelefono || !PHONE_REGEX.test(numeroTelefono)) {
    return 'El teléfono sólo puede contener dígitos (7 a 15 caracteres)';
  }

  if (!correo || !validator.isEmail(correo)) return 'Ingresa un correo válido';

  if (!password || typeof password !== 'string' || password.length < 6) {
    return 'La contraseña debe tener al menos 6 caracteres';
  }

  return null;
}

/**
 * Authenticate a user. Returns token data on success, throws on failure.
 */
async function loginUser(correo, password) {
  const user = await User.findOne({ correo }).select('+password');
  if (!user) throw Object.assign(new Error('Credenciales inválidas'), { status: 401 });

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw Object.assign(new Error('Credenciales inválidas'), { status: 401 });

  const payload = { id: user._id, role: user.rol, correo: user.correo };
  const token = sign(payload);

  const userObj = user.toObject();
  delete userObj.password;

  return { token, user: userObj, expiresIn: SESSION_TTL_SECONDS, cookieName: COOKIE_NAME, cookieOptions: COOKIE_OPTIONS };
}

/**
 * Register a new user. Returns the created user object (without password).
 */
async function registerUser({ nombre, apellido, edad, numeroTelefono, correo, password }) {
  const nuevo = new User({ nombre, apellido, edad: Number(edad), numeroTelefono, correo, password, rol: 'Usuario' });
  const guardado = await nuevo.save();
  const userObj = guardado.toObject();
  delete userObj.password;
  return userObj;
}

/**
 * Fetch the authenticated user by ID.
 */
async function getMe(userId) {
  return User.findById(userId).select('-password');
}

module.exports = { normalizarCorreo, validarDatosRegistro, loginUser, registerUser, getMe };
