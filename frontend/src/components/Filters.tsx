import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { useQueryParams } from '../hooks/useQueryParams'

export default function Filters(){
  const { params, set } = useQueryParams()
  const [cats,setCats] = useState<{name:string; slug:string; count?:number}[]>([])

  useEffect(()=>{ api.categories.list().then(setCats).catch(()=>setCats([])) },[])

  const q = params.get('q')||''
  const cat = params.get('category')||''
  const sort = params.get('sort')||'-createdAt'

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      {/* Chips de categorías */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={()=>set('category','')}
          className={`chip ${!cat? 'chip-active':''}`}
          aria-pressed={!cat}
        >Todas</button>

        {cats.map(c=> (
          <button
            key={c.slug}
            onClick={()=>set('category', c.slug)}
            className={`chip ${cat===c.slug? 'chip-active':''}`}
            aria-pressed={cat===c.slug}
          >{c.name}</button>
        ))}
      </div>

      {/* Orden + (opcional) input de búsqueda del catálogo */}
      <div className="flex items-center gap-2">
        {/* Si no quieres el input aquí, comenta este bloque */}
        {/* 
        <input
          defaultValue={q}
          onChange={e=>{ const v=e.target.value; const t=setTimeout(()=>set('q', v), 300); return ()=>clearTimeout(t as any) }}
          placeholder="Buscar…"
          className="border rounded-xl px-3 py-2 text-sm w-64 max-w-full bg-white"
        />
        */}
        <label className="opacity-70 text-xs">Orden</label>
        <select
          value={sort}
          onChange={e=>set('sort', e.target.value)}
          className="border rounded-xl px-3 py-2 text-sm bg-white"
        >
          <option value="-createdAt">Nuevos</option>
          <option value="price">Precio: menor a mayor</option>
          <option value="-price">Precio: mayor a menor</option>
        </select>
      </div>
    </div>
  )
}
