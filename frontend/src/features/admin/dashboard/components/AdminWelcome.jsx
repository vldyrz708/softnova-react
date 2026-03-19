import useAuthStore, { selectAuthUser } from '@/store/auth.js'
import '../css/AdminWelcome.css'

const AdminWelcome = () => {
  const user = useAuthStore(selectAuthUser)
  const firstName = user?.nombre || 'Administrador'

  return (
    <div className="aw-hero">
      {/* Background decoration */}
      <div className="aw-hero__bg" aria-hidden="true">
        <div className="aw-hero__circle" />
        <div className="aw-hero__circle aw-hero__circle--2" />
        <span className="aw-hero__watermark">K-BIAS</span>
      </div>

      {/* Content */}
      <div className="aw-hero__content">
        <p className="aw-hero__eyebrow">Bienvenido de vuelta</p>
        <h1 className="aw-hero__name">{firstName}</h1>
        <p className="aw-hero__subtitle">
          Gestiona el catálogo, usuarios y ventas desde aquí.
        </p>
        <span className="aw-hero__badge">Panel Administrativo</span>
      </div>

      {/* Right visual accent */}
      <div className="aw-hero__visual" aria-hidden="true">
        <div className="aw-hero__orb" />
        <span className="aw-hero__brand">K·BIAS<br />MERCH</span>
      </div>
    </div>
  )
}

export default AdminWelcome
