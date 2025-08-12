import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { useQueryParams } from '../hooks/useQueryParams'

export default function Filters() {
    const { params, set } = useQueryParams()
    const [cats, setCats] = useState<{ name: string; slug: string; count?: number }[]>([])
    useEffect(() => { api.categories.list().then(setCats).catch(() => setCats([])) }, [])

    const q = params.get('q') || ''
    const cat = params.get('category') || ''
    const sort = params.get('sort') || ''

    return (
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 flex-wrap">
                <input defaultValue={q} onChange={e => setTimeout(() => set('q', e.target.value), 250)} placeholder="Buscar…" className="border rounded-xl px-3 py-2 w-64" />
                <div className="flex gap-2 overflow-x-auto py-1">
                    <button onClick={() => set('category', '')} className={`chip ${!cat ? 'chip-active' : ''}`}>Todas</button>
                    {cats.map(c => (
                        <button key={c.slug} onClick={() => set('category', c.slug)} className={`chip ${cat === c.slug ? 'chip-active' : ''}`}>{c.name}</button>
                    ))}
                </div>
            </div>
            <div className="flex items-center gap-2">
                <label className="opacity-70 text-sm">Orden</label>
                <select value={sort} onChange={e => set('sort', e.target.value)} className="border rounded-xl px-3 py-2">
                    <option value="-createdAt">Nuevos</option>
                    <option value="price">Precio: menor a mayor</option>
                    <option value="-price">Precio: mayor a menor</option>
                </select>
            </div>
        </div>
    )
}