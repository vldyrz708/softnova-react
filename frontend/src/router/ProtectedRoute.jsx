import { Navigate, Outlet, useLocation } from 'react-router-dom'

import useAuthStore, { selectAuthUser, selectIsAuthenticated } from '@/store/auth.js'

const ProtectedRoute = ({ allowedRoles }) => {
  const location = useLocation()
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const user = useAuthStore(selectAuthUser)

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  if (allowedRoles?.length && user && !allowedRoles.includes(user.rol)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
