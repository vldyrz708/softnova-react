const { validateAge } = require('./validateAge')

async function updateUser({ id, cambios }, { userRepository, passwordHasher }) {
  const data = { ...cambios }

  if (data.edad !== undefined) {
    const errorEdad = validateAge(data.edad)
    if (errorEdad) throw Object.assign(new Error(errorEdad), { status: 400 })
    data.edad = Number(data.edad)
  }

  const plain = data.contrasena || data.password
  if (plain) {
    data.password = await passwordHasher.hash(plain)
    delete data.contrasena
  } else {
    delete data.password
    delete data.contrasena
  }

  return userRepository.updateById(id, data)
}

module.exports = { updateUser }
