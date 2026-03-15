import './ErrorState.css'

const ErrorState = ({ title = 'Algo salió mal', description = 'Vuelve a intentarlo en unos segundos.', actionLabel = 'Reintentar', onRetry }) => {
  return (
    <div className="error-state">
      <h3>{title}</h3>
      <p>{description}</p>
      {onRetry && (
        <button className="error-state__btn" type="button" onClick={onRetry}>
          {actionLabel}
        </button>
      )}
    </div>
  )
}

export default ErrorState
