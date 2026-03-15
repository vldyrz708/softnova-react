import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import './Topbar.css'
import { authApi } from '@/features/auth/api.js'
import useAuthStore, { selectAuthUser } from '@/features/auth/store.js'

const Topbar = ({ onMenuToggle }) => {
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

      <style>{`
        .topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          padding: 10px 24px;
          background: #fff;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
          position: relative;
          z-index: 10;
        }
        .topbar__left {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .topbar__hamburger {
          background: none;
          border: 1px solid #ccc;
          border-radius: 8px;
          padding: 8px 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          color: #000;
          transition: background 0.2s, border-color 0.2s;
        }
        .topbar__hamburger:hover {
          background: #f0f0f0;
          border-color: #888;
        }
        .topbar__brand {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }
        .topbar__brand img {
          width: 50px;
          height: 50px;
          object-fit: contain;
        }
        .topbar__brand span {
          font-weight: 600;
          font-size: 2.1rem;
          color: #000;
        }
        .topbar__right {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .topbar__search {
          display: flex;
          align-items: center;
          border: 1px solid #ccc;
          border-radius: 25px;
          overflow: hidden;
          width: 160px;
          transition: width 0.4s ease, border-color 0.3s;
          background: #fff;
        }
        .topbar__search:focus-within {
          width: 260px;
          border-color: #888;
        }
        .topbar__search input {
          border: none;
          outline: none;
          padding: 8px 14px;
          font-size: 14px;
          flex: 1;
          background: transparent;
          min-width: 0;
        }
        .topbar__search input::-webkit-search-cancel-button { display: none; }
        .topbar__search-icon {
          padding: 0 12px;
          color: #666;
          display: flex;
          align-items: center;
          transition: color 0.3s;
          flex-shrink: 0;
        }
        .topbar__search:focus-within .topbar__search-icon {
          color: #000;
        }
        .topbar__user {
          display: flex;
          flex-direction: column;
          text-align: right;
          line-height: 1.25;
        }
        .topbar__user strong {
          font-size: 0.88rem;
          font-weight: 700;
          color: #000;
        }
        .topbar__user span {
          font-size: 0.75rem;
          color: #666;
          text-transform: capitalize;
        }
        .topbar__logout {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #000;
          color: #fff;
          border: none;
          border-radius: 50px;
          padding: 8px 18px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.2s, transform 0.2s;
        }
        .topbar__logout:hover:not(:disabled) {
          background: #333;
          transform: translateY(-2px);
        }
      `}</style>
    </header>
  )
}

export default Topbar
