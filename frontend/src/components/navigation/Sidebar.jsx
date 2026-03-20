import { NavLink, useLocation } from 'react-router-dom'

import './Sidebar.css'
import { HOME_BY_ROLE, NAVIGATION } from '@/constants/navigation.js'
import useAuthStore, { selectAuthUser } from '@/store/auth.js'

const Sidebar = ({ open, onClose }) => {
  const user = useAuthStore(selectAuthUser)
  const role = user?.rol || 'Usuario'
  const { pathname } = useLocation()

  const homeLink = HOME_BY_ROLE[role] || '/app'
  const navItems = NAVIGATION.filter((item) => !item.roles || item.roles.includes(role))
  const isCajero = pathname.includes('/app/cajero')
  const activeSection = localStorage.getItem('cajero_section') || 'inicio'

  const handleSectionClick = (section) => {
    localStorage.setItem('cajero_section', section)
    window.location.reload()
  }

  return (
    <>
      {open && <div className="sidebar-backdrop" onClick={onClose} />}

      <div className={`sidebar-drawer${open ? ' sidebar-drawer--open' : ''}`}>
        <div className="sidebar-drawer__header">
          <h5>Menú</h5>
          <button type="button" onClick={onClose} aria-label="Cerrar menú">✕</button>
        </div>
        <div className="sidebar-drawer__body">
          {isCajero ? (
            <>
              <button
                className={`sidebar-section-btn ${activeSection === 'inicio' ? 'active' : ''}`}
                onClick={() => handleSectionClick('inicio')}
              >
                Inicio
              </button>
              <button
                className={`sidebar-section-btn ${activeSection === 'catalogo' ? 'active' : ''}`}
                onClick={() => handleSectionClick('catalogo')}
              >
                Catálogo
              </button>
            </>
          ) : (
            <>
              <NavLink to={homeLink} onClick={onClose}>Inicio</NavLink>
              {navItems.map((item) => (
                <NavLink key={item.path} to={item.path} onClick={onClose}>
                  {item.label}
                </NavLink>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default Sidebar
