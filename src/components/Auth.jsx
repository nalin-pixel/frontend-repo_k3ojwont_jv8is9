import { useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Auth({ onAuthed }) {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    full_name: '',
    role: 'tenant',
    email: '',
    phone: '',
    national_id: '',
    password: ''
  })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const doLogin = async () => {
    setLoading(true); setError('')
    try {
      const body = new URLSearchParams()
      body.append('username', form.email || form.phone || form.national_id)
      body.append('password', form.password)
      const res = await fetch(`${API}/auth/login`, { method: 'POST', body })
      if (!res.ok) throw new Error('Invalid credentials')
      const data = await res.json()
      onAuthed(data.access_token)
    } catch (e) { setError(e.message) } finally { setLoading(false) }
  }

  const doRegister = async () => {
    setLoading(true); setError('')
    try {
      if (!form.email && !form.phone) throw new Error('Email or phone required')
      const res = await fetch(`${API}/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (!res.ok) throw new Error('Failed to register')
      const data = await res.json()
      onAuthed(data.access_token)
    } catch (e) { setError(e.message) } finally { setLoading(false) }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">{isLogin ? 'Login' : 'Create Account'}</h2>
      {!isLogin && (
        <div className="grid grid-cols-2 gap-3">
          <input className="border p-2 rounded" placeholder="Full name" name="full_name" value={form.full_name} onChange={handleChange} />
          <select className="border p-2 rounded" name="role" value={form.role} onChange={handleChange}>
            <option value="tenant">Tenant</option>
            <option value="landlord">Landlord</option>
            <option value="lodge_owner">Lodge Owner</option>
          </select>
        </div>
      )}
      <div className="grid grid-cols-1 gap-3 mt-3">
        <input className="border p-2 rounded" placeholder="Email (or leave blank)" name="email" value={form.email} onChange={handleChange} />
        <input className="border p-2 rounded" placeholder="Phone (or leave blank)" name="phone" value={form.phone} onChange={handleChange} />
        {!isLogin && <input className="border p-2 rounded" placeholder="National ID (required)" name="national_id" value={form.national_id} onChange={handleChange} />}
        {isLogin && <input className="border p-2 rounded" placeholder="Email/Phone/National ID" value={form.email || form.phone || form.national_id} onChange={(e)=>{
          const v = e.target.value; setForm({...form, email: v, phone: v, national_id: v})
        }} />}
        <input type="password" className="border p-2 rounded" placeholder="Password" name="password" value={form.password} onChange={handleChange} />
      </div>
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      <div className="flex gap-3 mt-4">
        {isLogin ? (
          <button disabled={loading} onClick={doLogin} className="bg-blue-600 text-white px-4 py-2 rounded">{loading? 'Signing in...' : 'Login'}</button>
        ) : (
          <button disabled={loading} onClick={doRegister} className="bg-green-600 text-white px-4 py-2 rounded">{loading? 'Creating...' : 'Register'}</button>
        )}
        <button onClick={()=>setIsLogin(!isLogin)} className="px-3 py-2 text-sm">{isLogin? 'Create account' : 'Have an account? Login'}</button>
      </div>
    </div>
  )
}
