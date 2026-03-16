import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useLocation, useNavigate } from 'react-router-dom'

import { authApi } from '../api.js'
import './LoginPage.css'
import useAuthStore, { selectIsAuthenticated } from '@/store/auth.js'
import { HOME_BY_ROLE } from '@/constants/navigation.js'

const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const setCredentials = useAuthStore((state) => state.setCredentials)
  const [form, setForm] = useState({ correo: '', password: '' })

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: ({ data }) => {
      setCredentials({ token: data.token, user: data.user, expiresIn: data.expiresIn })
      const from = location.state?.from?.pathname
      const roleHome = HOME_BY_ROLE[data.user?.rol] || '/app/albums'
      navigate(from || roleHome, { replace: true })
    },
  })

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    loginMutation.mutate(form)
  }

  return (
    <div className="lp-bg">
      <div className="lp-card">
        <div className="lp-icon-wrap">
          <img src="/legacy/images/logo.png" alt="Logo" className="lp-logo" />
        </div>
        <h2>¡Bienvenido de nuevo!</h2>
        <form onSubmit={handleSubmit}>
          <div className="lp-field">
            <label>Correo electrónico</label>
            <input name="correo" type="email" value={form.correo} onChange={handleChange} required placeholder="usuario@dominio.com" />
          </div>
          <div className="lp-field">
            <label>Contraseña</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} required placeholder="••••••" />
          </div>
          <button type="submit" className="lp-btn" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? 'Validando…' : 'Iniciar sesión'}
          </button>
          {loginMutation.isError && <p className="lp-error">Credenciales no válidas</p>}
        </form>
      </div>
    </div>
  )
}

export default LoginPage
