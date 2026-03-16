import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import './Topbar.css'
import { authApi } from '@/features/auth/api.js'
import useAuthStore, { selectAuthUser } from '@/store/auth.js'

const Topbar = ({ onMenuToggle, showSearch = true }) => {
  const navigate = useNavigate()
  const user = useAuthStore(selectAuthUser)
  const clearSession = useAuthStore((state) => state.clearSession)
  const [search, setSearch] = useState('')

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      navigate('/', { replace: true })
      clearSession()
    },
  })

  return (
    <header className="topbar">
      {/* Izquierda: hamburguesa + logo + brand */}
      <div className="topbar__left">
        <button type="button" className="topbar__hamburger" onClick={onMenuToggle} aria-label="Abrir menú">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <a href="#" className="topbar__brand">
          <img src="/legacy/images/logo.png" alt="Logo" />
          <span>K-Bias Merch</span>
        </a>
      </div>

      {/* Derecha: buscador + usuario + logout */}
      <div className="topbar__right">
        {showSearch && (
          <div className="topbar__search">
            <input
              type="search"
              placeholder="Buscar"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className="topbar__search-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="5" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
          </div>
        )}

        <div className="topbar__user">
          <strong>{user?.nombre || 'Invitado'}</strong>
          <span>{user?.rol || 'Usuario'}</span>
        </div>

        <button
          type="button"
          className="topbar__logout"
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          {logoutMutation.isPending ? 'Saliendo…' : 'Cerrar sesión'}
        </button>
      </div>
    </header>
  )
}

export default Topbar
