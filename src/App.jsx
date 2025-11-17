import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Auth from './components/Auth'
import ListingCreate from './components/ListingCreate'
import Listings from './components/Listings'
import { TenantDashboard, OwnerDashboard, AdminDashboard } from './components/Dashboards'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function App() {
  const [view, setView] = useState('home')
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (token) localStorage.setItem('token', token)
    else localStorage.removeItem('token')
  }, [token])

  // Very lightweight user fetch based on token contents not available; keep role via manual selection after login if needed

  const onLogout = () => { setToken(''); setUser(null); setView('home') }

  const onAuthed = (tok) => {
    setToken(tok)
    // For demo we’ll ask user to pick role again by opening profile later; keep simple now
    setView('listings')
  }

  const onApply = async (listing) => {
    const national_id = prompt('Enter your National ID to apply:')
    if (!national_id) return
    const res = await fetch(`${API}/applications`, { method:'POST', headers: { 'Content-Type':'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ listing_id: listing._id, national_id }) })
    if (res.ok) alert('Application submitted')
    else alert('Failed')
  }

  const pay = async (listing) => {
    const method = 'ecocash'
    const res = await fetch(`${API}/payments/init`, { method: 'POST', headers: { 'Content-Type':'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ listing_id: listing._id, method }) })
    const data = await res.json()
    if (res.ok) alert(`Payment success. Owner gets $${data.owner_amount}, platform fee $${data.platform_fee}. Receipt ${data.receipt_id}`)
    else alert('Payment failed')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={onLogout} setView={setView} />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {view === 'home' && (
          <section className="text-center py-16">
            <h1 className="text-3xl md:text-5xl font-bold">Find your next home or lodge stay</h1>
            <p className="text-gray-600 mt-3">Browse verified listings across Zimbabwe. Apply and pay online with a secure 95/5 split for owners and platform.</p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button onClick={()=>setView('listings')} className="bg-blue-600 text-white px-5 py-2 rounded">Browse Listings</button>
              {!token && <button onClick={()=>setView('auth')} className="px-5 py-2 border rounded">Login / Register</button>}
            </div>
          </section>
        )}

        {view === 'auth' && <Auth onAuthed={onAuthed} />}

        {view === 'listings' && (
          <div className="space-y-6">
            {token && <ListingCreate token={token} onCreated={()=>{}} />}
            <Listings token={token} onApply={token ? onApply : null} />
          </div>
        )}

        {view === 'tenant' && <TenantDashboard token={token} />}
        {view === 'owner' && <OwnerDashboard token={token} />}
        {view === 'admin' && <AdminDashboard token={token} />}
      </main>
    </div>
  )
}

export default App
