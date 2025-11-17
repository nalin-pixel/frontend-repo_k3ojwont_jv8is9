import { useEffect } from 'react'

export default function Navbar({ user, onLogout, setView }) {
  useEffect(() => {}, [user])
  return (
    <header className="w-full border-b bg-white/80 backdrop-blur sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-blue-600 text-white flex items-center justify-center font-bold">T</div>
          <span className="font-semibold">Takuezy Housing</span>
        </div>
        <nav className="flex items-center gap-3 text-sm">
          <button className="hover:text-blue-600" onClick={() => setView('home')}>Home</button>
          <button className="hover:text-blue-600" onClick={() => setView('listings')}>Browse</button>
          {user && (user.role === 'landlord' || user.role === 'lodge_owner') && (
            <button className="hover:text-blue-600" onClick={() => setView('owner')}>My Properties</button>
          )}
          {user && user.role === 'tenant' && (
            <button className="hover:text-blue-600" onClick={() => setView('tenant')}>My Dashboard</button>
          )}
          {user && user.role === 'admin' && (
            <button className="hover:text-blue-600" onClick={() => setView('admin')}>Admin</button>
          )}
          {user ? (
            <button className="ml-4 bg-gray-800 text-white px-3 py-1 rounded" onClick={onLogout}>Logout</button>
          ) : (
            <button className="ml-4 bg-blue-600 text-white px-3 py-1 rounded" onClick={() => setView('auth')}>Login</button>
          )}
        </nav>
      </div>
    </header>
  )
}
