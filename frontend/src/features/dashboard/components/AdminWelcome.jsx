import useAuthStore, { selectAuthUser } from '@/store/auth.js'
import './AdminWelcome.css'

const AdminWelcome = () => {
  const user = useAuthStore(selectAuthUser)
  const firstName = user?.nombre || 'Administrador'

  return (
    <div className="aw-card">
      <div className="aw-body">
        <p className="aw-eyebrow">Bienvenido de vuelta</p>
        <h1 className="aw-name">{firstName}</h1>
        <p className="aw-subtitle">
          Administra productos, usuarios y ventas desde un solo lugar.
        </p>
        <span className="aw-badge">Administrador</span>
      </div>

      {/* Decorative rings — purely visual */}
      <div className="aw-visual" aria-hidden="true">
        <div className="aw-ring aw-ring--a" />
        <div className="aw-ring aw-ring--b" />
        <div className="aw-ring aw-ring--c" />
      </div>
    </div>
  )
}

export default AdminWelcome
