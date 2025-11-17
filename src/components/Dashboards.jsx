import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export function TenantDashboard({ token }) {
  const [apps, setApps] = useState([])
  const [payments, setPayments] = useState([])

  const load = async () => {
    // simple fetches using token to filter server-side could be added later
    const a = await fetch(`${API}/applications/me`, { headers: { Authorization: `Bearer ${token}` } })
    if (a.ok) setApps((await a.json()).items || [])
    const p = await fetch(`${API}/payments/me`, { headers: { Authorization: `Bearer ${token}` } })
    if (p.ok) setPayments((await p.json()).items || [])
  }
  useEffect(()=>{ load() },[])

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="bg-white rounded shadow p-4">
        <h3 className="font-semibold mb-2">Applications</h3>
        <ul className="space-y-2">
          {apps.map(a => <li key={a._id} className="text-sm">{a.listing_id} • <span className={a.status==='approved'?'text-green-600':a.status==='rejected'?'text-red-600':'text-gray-600'}>{a.status}</span></li>)}
        </ul>
      </div>
      <div className="bg-white rounded shadow p-4">
        <h3 className="font-semibold mb-2">Payment History</h3>
        <ul className="space-y-2">
          {payments.map(p => <li key={p._id} className="text-sm">${p.amount} • {p.status} • {p.reference || p.receipt_id}</li>)}
        </ul>
      </div>
    </div>
  )
}

export function OwnerDashboard({ token }) {
  const [apps, setApps] = useState([])
  const [payouts, setPayouts] = useState([])

  const load = async () => {
    const a = await fetch(`${API}/applications/for-me`, { headers: { Authorization: `Bearer ${token}` } })
    if (a.ok) setApps((await a.json()).items || [])
    const p = await fetch(`${API}/payments/for-me`, { headers: { Authorization: `Bearer ${token}` } })
    if (p.ok) setPayouts((await p.json()).items || [])
  }
  useEffect(()=>{ load() },[])

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="bg-white rounded shadow p-4">
        <h3 className="font-semibold mb-2">Applications</h3>
        <ul className="space-y-2">
          {apps.map(a => <li key={a._id} className="text-sm">{a.tenant_id} • {a.status}</li>)}
        </ul>
      </div>
      <div className="bg-white rounded shadow p-4">
        <h3 className="font-semibold mb-2">Payout History</h3>
        <ul className="space-y-2">
          {payouts.map(p => <li key={p._id} className="text-sm">Owner gets ${p.owner_amount} • Fee ${p.platform_fee}</li>)}
        </ul>
      </div>
    </div>
  )
}

export function AdminDashboard({ token }) {
  const [users, setUsers] = useState([])

  const load = async () => {
    const u = await fetch(`${API}/admin/users`, { headers: { Authorization: `Bearer ${token}` } })
    if (u.ok) setUsers((await u.json()).items || [])
  }
  useEffect(()=>{ load() },[])

  const setFlag = async (id, path) => {
    await fetch(`${API}${path}`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } })
    load()
  }

  return (
    <div className="bg-white rounded shadow p-4">
      <h3 className="font-semibold mb-2">Users</h3>
      <ul className="space-y-2">
        {users.map(u => (
          <li key={u._id} className="text-sm flex items-center justify-between">
            <span>{u.full_name} • {u.role} • {u.national_id}</span>
            <span className="flex items-center gap-2">
              <button className="text-xs px-2 py-1 border rounded" onClick={()=>setFlag(u._id, `/admin/users/${u._id}/approve?approve=${!u.is_approved}`)}>{u.is_approved? 'Unapprove' : 'Approve'}</button>
              <button className="text-xs px-2 py-1 border rounded" onClick={()=>setFlag(u._id, `/admin/users/${u._id}/verify-id?verified=${!u.id_verified}`)}>{u.id_verified? 'Unverify ID' : 'Verify ID'}</button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
