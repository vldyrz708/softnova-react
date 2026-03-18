const User = require('../../../../../models/User')

function createUserRepository() {
  return {
    async create(data) {
      const nuevo = new User(data)
      const guardado = await nuevo.save()
      const obj = guardado.toObject()
      delete obj.password
      return obj
    },

    async list() {
      return User.find().select('-password').sort({ createdAt: -1 })
    },

    async getById(id) {
      return User.findById(id).select('-password')
    },

    async updateById(id, data) {
      return User.findByIdAndUpdate(id, data, { new: true, runValidators: true }).select('-password')
    },

    async deleteById(id) {
      return User.findByIdAndDelete(id)
    },

    async findByEmail(email, { includePassword = false } = {}) {
      const q = User.findOne({ correo: email })
      if (includePassword) q.select('+password')
      return q
    },
  }
}

module.exports = { createUserRepository }
