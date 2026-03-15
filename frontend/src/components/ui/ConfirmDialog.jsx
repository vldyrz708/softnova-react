import './ConfirmDialog.css'

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, confirmLabel = 'Confirmar', danger = false }) => {
  if (!isOpen) return null

  return (
    <div className="cd-overlay" role="dialog" aria-modal="true" onMouseDown={(e) => { if (e.target === e.currentTarget) onCancel() }}>
      <div className="cd-box">
        <h3 className="cd-title">{title}</h3>
        {message && <p className="cd-message">{message}</p>}
        <div className="cd-actions">
          <button className="cd-btn cd-cancel" onClick={onCancel}>Cancelar</button>
          <button className={`cd-btn ${danger ? 'cd-danger' : 'cd-primary'}`} onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
