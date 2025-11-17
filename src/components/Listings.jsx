import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Listings({ token, forOwner=false, onApply }) {
  const [items, setItems] = useState([])
  const [q, setQ] = useState('')
  const [type, setType] = useState('')
  const [min, setMin] = useState('')
  const [max, setMax] = useState('')

  const load = async () => {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (type) params.set('property_type', type)
    if (min) params.set('min_price', min)
    if (max) params.set('max_price', max)
    const res = await fetch(`${API}/listings?${params.toString()}`)
    const data = await res.json()
    setItems(data.items || [])
  }

  useEffect(() => { load() }, [])

  const toggleAvailability = async (id, is_available) => {
    await fetch(`${API}/listings/${id}/availability?is_available=${!is_available}`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}` } })
    load()
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input className="border p-2 rounded w-48" placeholder="Search" value={q} onChange={(e)=>setQ(e.target.value)} />
        <select className="border p-2 rounded" value={type} onChange={(e)=>setType(e.target.value)}>
          <option value="">Any Type</option>
          <option value="room">Room</option>
          <option value="house">House</option>
          <option value="apartment">Apartment</option>
          <option value="lodge_room">Lodge</option>
        </select>
        <input className="border p-2 rounded w-24" placeholder="Min" value={min} onChange={(e)=>setMin(e.target.value)} />
        <input className="border p-2 rounded w-24" placeholder="Max" value={max} onChange={(e)=>setMax(e.target.value)} />
        <button className="bg-gray-800 text-white px-3 rounded" onClick={load}>Filter</button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {items.map(it => (
          <div key={it._id} className="bg-white rounded shadow overflow-hidden">
            {it.media_urls?.[0] ? (
              <img src={it.media_urls[0]} alt="media" className="h-40 w-full object-cover" />
            ) : (
              <div className="h-40 bg-gray-100 flex items-center justify-center text-gray-400">No Image</div>
            )}
            <div className="p-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">{it.title}</h4>
                <span className="text-sm px-2 py-0.5 rounded bg-blue-50 text-blue-700">{it.pricing_type}</span>
              </div>
              <p className="text-sm text-gray-600">${it.price} • {it.property_type}</p>
              <p className="text-xs text-gray-500 line-clamp-2">{it.description}</p>
              <p className="text-xs mt-1">{it.location?.address}</p>
              <div className="mt-3 flex items-center gap-2">
                {onApply && <button className="bg-blue-600 text-white text-sm px-3 py-1 rounded" onClick={()=>onApply(it)}>Apply</button>}
                {token && it.owner_id && (
                  <button className="text-xs px-2 py-1 border rounded" onClick={()=>toggleAvailability(it._id, it.is_available)}>
                    {it.is_available ? 'Set Occupied' : 'Set Available'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
