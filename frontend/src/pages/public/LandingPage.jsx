import { useMemo, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { authApi } from '@/features/auth/api.js'
import { HOME_BY_ROLE } from '@/constants/navigation.js'
import useAuthStore, { selectAuthUser, selectIsAuthenticated } from '@/features/auth/store.js'

import '@/styles/marketing.css'

const NAME_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/
const PHONE_REGEX = /^\d{7,15}$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const EDAD_MIN = 16
const EDAD_MAX = 99

const brandLogos = ['blackpink.png', 'bts.png', 'twice.png', 'allday.png', 'enhypen.png', 'lesserafim.png']

const LoginModal = ({ onClose, onSwitch }) => {
  const navigate = useNavigate()
  const setCredentials = useAuthStore((state) => state.setCredentials)
  const [form, setForm] = useState({ correo: '', password: '' })
  const [error, setError] = useState('')

  const loginMutation = useMutation({
    mutationFn: () => authApi.login(form),
    onMutate: () => setError(''),
    onSuccess: ({ data }) => {
      setCredentials({ token: data.token, user: data.user, expiresIn: data.expiresIn })
      onClose()
      const destination = HOME_BY_ROLE[data.user?.rol] || '/app'
      navigate(destination)
    },
    onError: () => setError('Credenciales inválidas, intenta de nuevo.'),
  })

  const handleSubmit = (event) => {
    event.preventDefault()
    loginMutation.mutate()
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card">
        <button className="modal-close" onClick={onClose} aria-label="Cerrar">
          ✕
        </button>
        <h2>¡Bienvenido de nuevo!</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="login-email">Correo electrónico</label>
          <input
            id="login-email"
            type="email"
            value={form.correo}
            onChange={(event) => setForm((prev) => ({ ...prev, correo: event.target.value }))}
            required
          />
          <label htmlFor="login-password">Contraseña</label>
          <input
            id="login-password"
            type="password"
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            required
          />
          {error && <p className="error-text">{error}</p>}
          <button type="submit" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? 'Validando…' : 'Iniciar sesión'}
          </button>
          <p className="modal-switch-text">
            ¿No tienes cuenta?{' '}
            <button type="button" className="modal-switch-link" onClick={onSwitch}>
              Regístrate
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}

const RegisterModal = ({ onClose, onSwitch }) => {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    edad: '',
    numeroTelefono: '',
    correo: '',
    password: '',
  })
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState('')

  const registerMutation = useMutation({
    mutationFn: (payload) => authApi.register(payload),
    onSuccess: () => {
      setSuccess('Registro exitoso. Ya puedes iniciar sesión.')
      setForm({ nombre: '', apellido: '', edad: '', numeroTelefono: '', correo: '', password: '' })
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'No pudimos completar el registro.'
      setErrors((prev) => ({ ...prev, general: message }))
    },
  })

  const fieldErrors = useMemo(() => errors, [errors])

  const validate = () => {
    const nextErrors = {}
    if (!NAME_REGEX.test(form.nombre)) nextErrors.nombre = 'El nombre sólo permite letras y espacios.'
    if (!NAME_REGEX.test(form.apellido)) nextErrors.apellido = 'Los apellidos sólo permiten letras y espacios.'
    const ageNumber = Number(form.edad)
    if (!Number.isInteger(ageNumber) || ageNumber < EDAD_MIN || ageNumber > EDAD_MAX) {
      nextErrors.edad = `La edad debe estar entre ${EDAD_MIN} y ${EDAD_MAX}.`
    }
    if (!PHONE_REGEX.test(form.numeroTelefono)) nextErrors.numeroTelefono = 'Teléfono inválido (7 a 15 dígitos).'
    if (!EMAIL_REGEX.test(form.correo)) nextErrors.correo = 'Correo inválido.'
    if (!form.password || form.password.length < 6) nextErrors.password = 'La contraseña debe tener al menos 6 caracteres.'
    return nextErrors
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setSuccess('')
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) {
      registerMutation.mutate({
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        edad: Number(form.edad),
        numeroTelefono: form.numeroTelefono.trim(),
        correo: form.correo.trim().toLowerCase(),
        password: form.password,
      })
    }
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '', general: '' }))
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card">
        <button className="modal-close" onClick={onClose} aria-label="Cerrar">
          ✕
        </button>
        <h2>Registro de usuario</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="nombre">Nombre</label>
          <input id="nombre" name="nombre" value={form.nombre} onChange={handleChange} required />
          {fieldErrors.nombre && <span className="error-text">{fieldErrors.nombre}</span>}

          <label htmlFor="apellido">Apellidos</label>
          <input id="apellido" name="apellido" value={form.apellido} onChange={handleChange} required />
          {fieldErrors.apellido && <span className="error-text">{fieldErrors.apellido}</span>}

          <label htmlFor="edad">Edad</label>
          <input id="edad" name="edad" type="number" value={form.edad} onChange={handleChange} required />
          {fieldErrors.edad && <span className="error-text">{fieldErrors.edad}</span>}

          <label htmlFor="numeroTelefono">Teléfono</label>
          <input id="numeroTelefono" name="numeroTelefono" value={form.numeroTelefono} onChange={handleChange} required />
          {fieldErrors.numeroTelefono && <span className="error-text">{fieldErrors.numeroTelefono}</span>}

          <label htmlFor="correo">Correo</label>
          <input id="correo" name="correo" type="email" value={form.correo} onChange={handleChange} required />
          {fieldErrors.correo && <span className="error-text">{fieldErrors.correo}</span>}

          <label htmlFor="password">Contraseña</label>
          <input id="password" name="password" type="password" value={form.password} onChange={handleChange} required />
          {fieldErrors.password && <span className="error-text">{fieldErrors.password}</span>}

          {fieldErrors.general && <span className="error-text">{fieldErrors.general}</span>}
          {success && <p className="success-text">{success}</p>}

          <button type="submit" disabled={registerMutation.isPending}>
            {registerMutation.isPending ? 'Registrando…' : 'Registrarme'}
          </button>
          <p className="modal-switch-text">
            ¿Ya tienes cuenta?{' '}
            <button type="button" className="modal-switch-link" onClick={onSwitch}>
              Inicia sesión
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}

const LandingPage = () => {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const user = useAuthStore(selectAuthUser)
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)

  return (
    <div className="landing-page">
      <header className="landing-nav">
        <div className="landing-nav__inner">
          <div className="brand-mark">
            <img src="/legacy/images/logo.png" alt="K-Bias Merch" />
            <span>K-Bias Merch</span>
          </div>
          <div className="nav-actions">
            {isAuthenticated ? (
              <button className="btn-solid" onClick={() => navigate(HOME_BY_ROLE[user?.rol] || '/app/albums')}>
                Ir al panel
              </button>
            ) : (
              <>
                <button className="btn-ghost" onClick={() => setShowRegister(true)}>
                  Regístrate
                </button>
                <button className="btn-solid" onClick={() => setShowLogin(true)}>
                  Inicia sesión
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="hero-landing">
        <div className="hero-landing__content">
          <p className="hero-landing__subtitle">PRODUCTOS EN VENTA DE K-POP</p>
          <h1 className="hero-landing__title">K-Bias Merch</h1>
          {!isAuthenticated && (
            <button className="btn-solid hero-cta" onClick={() => setShowLogin(true)}>
              Descubre el catálogo
            </button>
          )}
        </div>
      </section>

      <section className="brands-strip">
        <div className="brands-strip__inner">
          {brandLogos.map((logo) => (
            <img key={logo} src={`/legacy/images/${logo}`} alt={logo.replace('.png', '')} />
          ))}
        </div>
        <p className="brand-signature">© NOVA</p>
      </section>

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSwitch={() => { setShowLogin(false); setShowRegister(true) }}
        />
      )}
      {showRegister && (
        <RegisterModal
          onClose={() => setShowRegister(false)}
          onSwitch={() => { setShowRegister(false); setShowLogin(true) }}
        />
      )}
    </div>
  )
}

export default LandingPage
