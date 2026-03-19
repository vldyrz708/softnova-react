import { useNavigate } from 'react-router-dom'
import '../css/QuickActions.css'

// ── Icons ──────────────────────────────────────────────────────────────────
const GridIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
)

const PeopleIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const ChartIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
)

const ArrowIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

// ── Actions config ─────────────────────────────────────────────────────────
const ACTIONS = [
  {
    path: '/app/albums',
    icon: <GridIcon />,
    title: 'Gestionar álbumes',
    description: 'Crea, edita y elimina productos del catálogo de K-pop.',
    accent: '#ff8427',
  },
  {
    path: '/app/users',
    icon: <PeopleIcon />,
    title: 'Gestionar usuarios',
    description: 'Administra cuentas, roles y permisos del sistema.',
    accent: '#6366f1',
  },
  {
    path: '/app/sales',
    icon: <ChartIcon />,
    title: 'Reporte de ventas',
    description: 'Consulta el historial y estadísticas de ventas por período.',
    accent: '#10b981',
  },
]

// ── Component ──────────────────────────────────────────────────────────────
const QuickActions = () => {
  const navigate = useNavigate()

  return (
    <div className="quick-actions">
      {ACTIONS.map((action) => (
        <button
          key={action.title}
          type="button"
          className="qa-card"
          onClick={() => navigate(action.path)}
          style={{ '--qa-accent': action.accent }}
        >
          <div className="qa-card__icon">{action.icon}</div>

          <div className="qa-card__content">
            <p className="qa-card__title">{action.title}</p>
            <p className="qa-card__desc">{action.description}</p>
          </div>

          <div className="qa-card__footer">
            <span className="qa-card__cta">
              Ir al módulo <ArrowIcon />
            </span>
          </div>
        </button>
      ))}
    </div>
  )
}

export default QuickActions
