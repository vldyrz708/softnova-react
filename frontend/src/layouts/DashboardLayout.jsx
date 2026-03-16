import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import './DashboardLayout.css'
import Sidebar from '@/components/navigation/Sidebar.jsx'
import Topbar from '@/components/navigation/Topbar.jsx'
import useAuthSession from '@/hooks/useAuthSession.js'

const DashboardLayout = () => {
  useAuthSession()

  const { pathname } = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="layout">
      <Topbar onMenuToggle={() => setSidebarOpen(true)} showSearch={pathname !== '/app/admin'} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default DashboardLayout
