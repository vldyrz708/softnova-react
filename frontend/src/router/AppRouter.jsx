import { Navigate, Route, Routes } from 'react-router-dom'

import DashboardLayout from '@/layouts/DashboardLayout.jsx'
import AlbumsPage from '@/features/albums/pages/AlbumsPage.jsx'
import AdminHomePage from '@/features/dashboard/pages/AdminHomePage.jsx'
import CajeroHomePage from '@/features/dashboard/pages/CajeroHomePage.jsx'
import GerenteHomePage from '@/features/dashboard/pages/GerenteHomePage.jsx'
import LandingPage from '@/pages/public/LandingPage.jsx'
import LoginPage from '@/features/auth/pages/LoginPage.jsx'
import NotFoundPage from '@/pages/public/NotFoundPage.jsx'
import UsersPage from '@/features/users/pages/UsersPage.jsx'
import SalesReportPage from '@/features/sales/pages/SalesReportPage.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'
import useAuthStore, { selectAuthUser } from '@/features/auth/store.js'
import { HOME_BY_ROLE } from '@/constants/navigation.js'

const RoleRedirect = () => {
  const user = useAuthStore(selectAuthUser)
  return <Navigate to={HOME_BY_ROLE[user?.rol] || '/app/albums'} replace />
}

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/app" element={<DashboardLayout />}>
          {/* Shared catalog (all roles) */}
          <Route path="albums" element={<AlbumsPage />} />

          {/* Index: redirect to role-specific home */}
          <Route index element={<RoleRedirect />} />

          {/* Admin-only routes */}
          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
            <Route path="admin" element={<AdminHomePage />} />
          </Route>

          {/* Gerente-only routes */}
          <Route element={<ProtectedRoute allowedRoles={['Gerente']} />}>
            <Route path="gerente" element={<GerenteHomePage />} />
          </Route>

          {/* Cajero-only routes */}
          <Route element={<ProtectedRoute allowedRoles={['Usuario']} />}>
            <Route path="cajero" element={<CajeroHomePage />} />
          </Route>

          {/* Users management: Admin (full CRUD) + Gerente (create/edit) */}
          <Route element={<ProtectedRoute allowedRoles={['Admin', 'Gerente']} />}>
            <Route path="users" element={<UsersPage />} />
          </Route>

          {/* Sales report: Admin only */}
          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
            <Route path="sales" element={<SalesReportPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default AppRouter
