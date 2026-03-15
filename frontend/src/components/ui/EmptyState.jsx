import './EmptyState.css'

const EmptyState = ({ title = 'Sin registros todavía', description = 'Agrega un nuevo elemento para comenzar.' }) => {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}

export default EmptyState
