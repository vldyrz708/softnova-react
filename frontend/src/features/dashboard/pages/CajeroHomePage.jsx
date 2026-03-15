import { useNavigate } from 'react-router-dom'
import './RoleHomePage.css'

const BRANDS = ['blackpink.png', 'bts.png', 'twice.png', 'allday.png', 'enhypen.png', 'lesserafim.png']

const CajeroHomePage = () => {
  const navigate = useNavigate()

  return (
    <>
      <section className="rh-hero">
        <div className="rh-overlay" />
        <div className="rh-content">
          <h2 className="rh-subtitle">HOLA</h2>
          <h1 className="rh-title">CAJERO</h1>
          <div className="rh-actions">
            <button onClick={() => navigate('/app/albums')}>Ver Productos</button>
          </div>
        </div>
      </section>
      <section className="rh-brands">
        <div className="rh-brands__inner">
          {BRANDS.map((logo) => (
            <img key={logo} src={`/legacy/images/${logo}`} alt={logo.replace('.png', '')} />
          ))}
        </div>
        <p className="rh-brands__signature">© NOVA</p>
      </section>
    </>
  )
}

export default CajeroHomePage
