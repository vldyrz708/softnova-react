async function getUserById({ id }, { userRepository }) {
  return userRepository.getById(id)
}

module.exports = { getUserById }
