import { useQuery } from '@tanstack/react-query'
import client from '@/api/client.js'
import { formatCurrency } from '@/utils/format.js'
import '../css/DashboardStats.css'

// ── Icons ──────────────────────────────────────────────────────────────────
const AlbumIcon = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const UsersIcon = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const SalesIcon = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
)

const NoStockIcon = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <line x1="3.27" y1="6.96" x2="12" y2="12.01" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
)

// ── KPI card ───────────────────────────────────────────────────────────────
const KPICard = ({ icon, label, value, description, accentColor, isLoading }) => (
  <div className="kpi-card">
    <div
      className="kpi-card__icon"
      style={{ color: accentColor, background: `color-mix(in srgb, ${accentColor} 12%, white)` }}
    >
      {icon}
    </div>

    <div className="kpi-card__body">
      <p className="kpi-card__label">{label}</p>
      <p className="kpi-card__value">
        {isLoading ? <span className="kpi-card__skeleton" aria-hidden="true" /> : value}
      </p>
      <p className="kpi-card__desc">{!isLoading && description}</p>
    </div>

    <div className="kpi-card__accent" style={{ background: accentColor }} />
  </div>
)

// ── DashboardStats ─────────────────────────────────────────────────────────
const DashboardStats = () => {
  const { data: albumStats, isLoading: l1 } = useQuery({
    queryKey: ['admin-album-stats'],
    queryFn: () => client.get('/api/albums/stats').then((r) => r.data.data),
    staleTime: 5 * 60_000,
  })

  const { data: usersData, isLoading: l2 } = useQuery({
    queryKey: ['admin-users-count'],
    queryFn: () => client.get('/api/users').then((r) => r.data.data?.users ?? r.data.users),
    staleTime: 5 * 60_000,
  })

  const { data: salesData, isLoading: l3 } = useQuery({
    queryKey: ['admin-sales-mes'],
    queryFn: () => client.get('/api/sales/reporte?periodo=mes').then((r) => r.data),
    staleTime: 2 * 60_000,
  })

  const stats = [
    {
      icon: <AlbumIcon />,
      label: 'Total de álbumes',
      value: albumStats?.totalAlbumes ?? '—',
      description: 'productos en catálogo',
      accentColor: '#6366f1',
      isLoading: l1,
    },
    {
      icon: <UsersIcon />,
      label: 'Usuarios registrados',
      value: usersData?.length ?? '—',
      description: 'cuentas activas',
      accentColor: '#10b981',
      isLoading: l2,
    },
    {
      icon: <SalesIcon />,
      label: 'Ventas del mes',
      value: salesData?.resumen?.totalVentas ?? '—',
      description: salesData ? formatCurrency(salesData.resumen?.totalIngresos) : 'ingresos totales',
      accentColor: '#f59e0b',
      isLoading: l3,
    },
    {
      icon: <NoStockIcon />,
      label: 'Sin stock',
      value: albumStats?.albumesAgotados ?? '—',
      description: 'álbumes agotados',
      accentColor: '#ef4444',
      isLoading: l1,
    },
  ]

  return (
    <div className="dashboard-stats">
      {stats.map((s) => (
        <KPICard key={s.label} {...s} />
      ))}
    </div>
  )
}

export default DashboardStats
