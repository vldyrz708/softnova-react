import { Link } from 'react-router-dom'

import './NotFoundPage.css'

const NotFoundPage = () => (
  <section className="not-found">
    <h1>404</h1>
    <p>No encontramos la vista solicitada.</p>
    <Link to="/">Volver al panel</Link>
  </section>
)

export default NotFoundPage
