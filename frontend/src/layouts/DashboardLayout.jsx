import { useState } from 'react'
import { Outlet } from 'react-router-dom'

import './DashboardLayout.css'
import Sidebar from '@/components/navigation/Sidebar.jsx'
import Topbar from '@/components/navigation/Topbar.jsx'
import useAuthSession from '@/hooks/useAuthSession.js'

const DashboardLayout = () => {
  useAuthSession()

  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="layout">
      <Topbar onMenuToggle={() => setSidebarOpen(true)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default DashboardLayout
