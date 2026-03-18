const { validateAge } = require('./validateAge')

async function createUser({ nombre, apellido, edad, numeroTelefono, rol, correo, password }, { userRepository }) {
  const errorEdad = validateAge(edad)
  if (errorEdad) throw Object.assign(new Error(errorEdad), { status: 400 })
  if (!password) throw Object.assign(new Error('La contraseña es requerida'), { status: 400 })

  return userRepository.create({
    nombre,
    apellido,
    edad: Number(edad),
    numeroTelefono,
    rol,
    correo,
    // Let the Mongoose model pre-save hook hash passwords on create.
    password,
  })
}

module.exports = { createUser }
