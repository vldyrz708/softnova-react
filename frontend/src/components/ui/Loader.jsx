import './Loader.css'

const Loader = ({ label = 'Cargando información…' }) => {
  return (
    <div className="loader" aria-live="polite">
      <div className="loader__dot" />
      <div className="loader__dot" />
      <div className="loader__dot" />
      <span>{label}</span>
    </div>
  )
}

export default Loader
