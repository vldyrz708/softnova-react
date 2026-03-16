import { useState } from 'react'
import PageHeader from '@/components/ui/PageHeader.jsx'
import Loader from '@/components/ui/Loader.jsx'
import EmptyState from '@/components/ui/EmptyState.jsx'
import ErrorState from '@/components/ui/ErrorState.jsx'
import { useSalesReport } from '../hooks.js'
import { formatCurrency } from '@/utils/format.js'
import './SalesReportPage.css'

const PERIODOS = [
  { key: 'dia',    label: 'Por Día'    },
  { key: 'semana', label: 'Por Semana' },
  { key: 'mes',    label: 'Por Mes'    },
  { key: 'anio',   label: 'Por Año'    },
]

const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']

function etiqueta(d, periodo) {
  if (periodo === 'dia')    return `${d._id.dia}/${d._id.mes}/${d._id.anio}`
  if (periodo === 'semana') return `Sem ${d._id.semana} · ${d._id.anio}`
  if (periodo === 'mes')    return `${MESES[(d._id.mes ?? 1) - 1]} ${d._id.anio}`
  if (periodo === 'anio')   return `${d._id.anio}`
  return '—'
}

const SalesReportPage = () => {
  const [periodo, setPeriodo] = useState('mes')
  const { data, isLoading, isError, refetch } = useSalesReport(periodo)

  const resumen = data?.resumen || {}
  const filas   = data?.datos   || []

  return (
    <div className="sr-page">
      <PageHeader
        title="Reporte de Ventas"
        description="Consulta el historial de ventas agrupado por período de tiempo."
      />

      {/* Tabs de período */}
      <div className="sr-tabs">
        {PERIODOS.map((p) => (
          <button
            key={p.key}
            className={`sr-tab${periodo === p.key ? ' sr-tab--active' : ''}`}
            onClick={() => setPeriodo(p.key)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Cards resumen */}
      <div className="sr-summary">
        <div className="sr-card">
          <span className="sr-card__label">Total de ventas</span>
          <span className="sr-card__value">{resumen.totalVentas ?? '—'}</span>
        </div>
        <div className="sr-card">
          <span className="sr-card__label">Ingresos totales</span>
          <span className="sr-card__value">{formatCurrency(resumen.totalIngresos)}</span>
        </div>
        <div className="sr-card">
          <span className="sr-card__label">Unidades vendidas</span>
          <span className="sr-card__value">{resumen.totalUnidades ?? '—'}</span>
        </div>
      </div>

      {/* Contenido */}
      {isLoading && <Loader />}

      {isError && (
        <ErrorState
          title="No se pudo cargar el reporte"
          description="Verifica la conexión con el servidor."
          onRetry={refetch}
        />
      )}

      {!isLoading && !isError && filas.length === 0 && (
        <EmptyState
          title="Sin ventas registradas"
          description="No hay datos para el período seleccionado."
        />
      )}

      {!isLoading && !isError && filas.length > 0 && (
        <div className="sr-table-wrap">
          <table className="sr-table">
            <thead>
              <tr>
                <th>Período</th>
                <th>Ventas</th>
                <th>Unidades</th>
                <th>Ingresos</th>
              </tr>
            </thead>
            <tbody>
              {filas.map((fila, i) => (
                <tr key={i}>
                  <td>{etiqueta(fila, periodo)}</td>
                  <td>{fila.ventas}</td>
                  <td>{fila.unidades}</td>
                  <td>{formatCurrency(fila.ingresos)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default SalesReportPage
