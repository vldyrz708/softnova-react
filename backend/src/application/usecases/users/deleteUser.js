async function deleteUser({ id }, { userRepository }) {
  return userRepository.deleteById(id)
}

module.exports = { deleteUser }
