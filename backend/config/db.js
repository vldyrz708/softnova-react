const mongoose = require('mongoose')

const conection = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/productos_k-pop'
  console.log('Conectando a la base de datos...')

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10_000,
    })
    console.log('::: Conectado a la base de datos. :::')
  } catch (error) {
    console.error('Error en la conexión a la base de datos', error)
    process.exit(1)
  }
}

module.exports = conection