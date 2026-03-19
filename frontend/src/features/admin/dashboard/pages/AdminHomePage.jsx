import '../css/AdminHomePage.css'
import AdminWelcome from '../components/AdminWelcome.jsx'
import QuickActions from '../components/QuickActions.jsx'
import BrandStrip from '../components/BrandStrip.jsx'

const AdminHomePage = () => (
  <div className="admin-home">
    <AdminWelcome />

    <section>
      <h2 className="admin-home__section-label">Accesos rápidos</h2>
      <QuickActions />
    </section>

    <BrandStrip />
  </div>
)

export default AdminHomePage
