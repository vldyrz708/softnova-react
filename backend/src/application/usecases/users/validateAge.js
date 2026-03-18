const EDAD_MIN = 16
const EDAD_MAX = 99

function validateAge(edad) {
  if (edad === undefined || edad === null || edad === '') return 'La edad es requerida'
  const n = Number(edad)
  if (!Number.isInteger(n)) return 'La edad debe ser un número entero'
  if (n < EDAD_MIN || n > EDAD_MAX) return `La edad debe estar entre ${EDAD_MIN} y ${EDAD_MAX} años`
  return null
}

module.exports = { validateAge }
