import { Outlet } from 'react-router-dom'
import RequireAuth from '../components/RequireAuth'
import Sidebar from '../components/Sidebar'
import MobileSidebar from '../components/MobileSidebar'

export default function AppLayout() {
  return (
    <RequireAuth>
      <div className="min-h-screen flex bg-gray-50">
        <MobileSidebar />
        <Sidebar />
        <div className="flex-1 min-w-0">
          <div className="p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </RequireAuth>
  )
}


