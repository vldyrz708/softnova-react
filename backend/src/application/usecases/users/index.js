const { createUserRepository } = require('../../../infrastructure/db/mongoose/repositories/userRepository')
const { createPasswordHasher } = require('../../../infrastructure/security/passwordHasher')

const { createUser } = require('./createUser')
const { listUsers } = require('./listUsers')
const { getUserById } = require('./getUserById')
const { updateUser } = require('./updateUser')
const { deleteUser } = require('./deleteUser')

const userRepository = createUserRepository()
const passwordHasher = createPasswordHasher()

module.exports = {
  createUser: (input) => createUser(input, { userRepository }),
  listUsers: (input) => listUsers(input, { userRepository, passwordHasher }),
  getUserById: (input) => getUserById(input, { userRepository, passwordHasher }),
  updateUser: (input) => updateUser(input, { userRepository, passwordHasher }),
  deleteUser: (input) => deleteUser(input, { userRepository, passwordHasher }),
}
