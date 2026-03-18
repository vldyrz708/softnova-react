async function listUsers(_input, { userRepository }) {
  return userRepository.list()
}

module.exports = { listUsers }
