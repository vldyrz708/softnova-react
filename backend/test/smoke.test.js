const test = require('node:test')
const assert = require('node:assert/strict')

const request = require('supertest')
const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

const app = require('../app')
const { sign } = require('../utils/jwt')
const User = require('../models/User')
const Album = require('../models/Album')
const Sale = require('../models/Sale')

let mongo
let adminUser
let adminToken

test.before(async () => {
  process.env.JWT_SECRET = 'test-secret'
  mongo = await MongoMemoryServer.create()
  process.env.MONGODB_URI = mongo.getUri()

  await mongoose.connect(process.env.MONGODB_URI)

  adminUser = await User.create({
    nombre: 'Admin',
    apellido: 'Test',
    edad: 30,
    numeroTelefono: '1234567890',
    correo: 'admin@test.local',
    password: 'password123',
    rol: 'Admin',
  })

  adminToken = sign({ id: adminUser._id, role: 'Admin', correo: adminUser.correo })

  const album = await Album.create({
    nombreAlbum: 'Album Test',
    artista: 'Artista Test',
    versionAlbum: 'Standard',
    fechaLanzamiento: new Date('2020-01-01'),
    idioma: ['Coreano'],
    duracion: '42:00',
    pesoGramos: 500,
    precio: 10.5,
    stock: 10,
    categoria: ['K-Pop'],
    descripcion: 'Descripción de prueba suficientemente larga.',
    fotoAlbum: 'uploads/test.png',
    fechaAdquisicion: new Date('2021-01-01'),
    fechaLimiteVenta: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  })

  await Sale.create({
    album: album._id,
    cantidad: 1,
    precioUnitario: album.precio,
    total: album.precio,
    vendidoPor: adminUser._id,
    notas: 'smoke',
  })
})

test.after(async () => {
  await mongoose.disconnect()
  if (mongo) await mongo.stop()
})

test('GET /health returns healthy', async () => {
  const res = await request(app).get('/health')
  assert.equal(res.statusCode, 200)
  assert.equal(res.body.success, true)
  assert.equal(res.body.status, 'healthy')
})

test('GET /api/auth/me works with Bearer token', async () => {
  const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${adminToken}`)
  assert.equal(res.statusCode, 200)
  assert.equal(res.body.success, true)
  assert.equal(res.body.user.correo, adminUser.correo)
})

test('POST /api/auth/login works for a user created via /api/users (no double-hash)', async () => {
  const payload = {
    nombre: 'Nuevo',
    apellido: 'Usuario',
    edad: 25,
    numeroTelefono: '1234567899',
    rol: 'Usuario',
    correo: 'nuevo@test.local',
    password: 'secret123',
  }

  const created = await request(app)
    .post('/api/users')
    .set('Authorization', `Bearer ${adminToken}`)
    .send(payload)

  assert.equal(created.statusCode, 201)
  assert.equal(created.body.success, true)

  const login = await request(app).post('/api/auth/login').send({ correo: payload.correo, password: payload.password })
  assert.equal(login.statusCode, 200)
  assert.equal(login.body.success, true)
  assert.ok(login.body.token)
})

test('GET /api/albums/stats returns stats shape', async () => {
  const res = await request(app).get('/api/albums/stats')
  assert.equal(res.statusCode, 200)
  assert.equal(res.body.success, true)
  assert.ok(res.body.data)
  assert.equal(typeof res.body.data.totalAlbumes, 'number')
})

test('GET /api/sales/reporte requires Admin and returns report', async () => {
  const res = await request(app)
    .get('/api/sales/reporte?periodo=mes')
    .set('Authorization', `Bearer ${adminToken}`)

  assert.equal(res.statusCode, 200)
  assert.equal(res.body.success, true)
  assert.equal(res.body.periodo, 'mes')
  assert.ok(res.body.resumen)
  assert.ok(Array.isArray(res.body.datos))
})
