import { useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function ListingCreate({ token, onCreated }) {
  const [form, setForm] = useState({
    title: '', description: '', price: 0, pricing_type: 'monthly', property_type: 'room', facilities: '', media_urls: '',
    location: { lat: -17.8292, lng: 31.0522, address: 'Harare, Zimbabwe' }, is_available: true
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async () => {
    setLoading(true); setError('')
    try {
      const body = {
        ...form,
        facilities: form.facilities ? form.facilities.split(',').map(s=>s.trim()) : [],
        media_urls: form.media_urls ? form.media_urls.split(',').map(s=>s.trim()) : [],
      }
      const res = await fetch(`${API}/listings`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(body) })
      if (!res.ok) throw new Error('Failed to create listing')
      const data = await res.json()
      onCreated(data.id)
    } catch (e) { setError(e.message) } finally { setLoading(false) }
  }

  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="font-semibold mb-3">Add Property</h3>
      <div className="grid grid-cols-2 gap-3">
        <input className="border p-2 rounded" placeholder="Title" name="title" value={form.title} onChange={handleChange} />
        <input className="border p-2 rounded" placeholder="Price" name="price" value={form.price} onChange={handleChange} />
        <select className="border p-2 rounded" name="pricing_type" value={form.pricing_type} onChange={handleChange}>
          <option value="monthly">Monthly</option>
          <option value="daily">Daily</option>
          <option value="hourly">Hourly</option>
        </select>
        <select className="border p-2 rounded" name="property_type" value={form.property_type} onChange={handleChange}>
          <option value="room">Room</option>
          <option value="house">House</option>
          <option value="apartment">Apartment</option>
          <option value="lodge_room">Lodge Room</option>
          <option value="other">Other</option>
        </select>
        <input className="border p-2 rounded col-span-2" placeholder="Facilities (comma separated)" name="facilities" value={form.facilities} onChange={handleChange} />
        <input className="border p-2 rounded col-span-2" placeholder="Media URLs (comma separated)" name="media_urls" value={form.media_urls} onChange={handleChange} />
        <textarea className="border p-2 rounded col-span-2" placeholder="Description" name="description" value={form.description} onChange={handleChange}></textarea>
        <input className="border p-2 rounded" placeholder="Latitude" value={form.location.lat} onChange={(e)=>setForm({...form, location:{...form.location, lat: parseFloat(e.target.value)}})} />
        <input className="border p-2 rounded" placeholder="Longitude" value={form.location.lng} onChange={(e)=>setForm({...form, location:{...form.location, lng: parseFloat(e.target.value)}})} />
        <input className="border p-2 rounded col-span-2" placeholder="Address" value={form.location.address} onChange={(e)=>setForm({...form, location:{...form.location, address: e.target.value}})} />
      </div>
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      <button disabled={loading} onClick={submit} className="mt-3 bg-blue-600 text-white px-4 py-2 rounded">{loading? 'Saving...' : 'Save'}</button>
    </div>
  )
}
