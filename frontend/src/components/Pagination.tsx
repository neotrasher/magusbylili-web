import { useQueryParams } from '../hooks/useQueryParams'

export default function Pagination({ page, total, limit }:{ page:number; total:number; limit:number }){
  const { set, params } = useQueryParams()
  const pages = Math.max(1, Math.ceil(total/limit))
  const go = (n:number)=> set('page', String(n))
  if (pages<=1) return null
  return (
    <div className="flex items-center gap-2 justify-center mt-4">
      <button className="btn" disabled={page<=1} onClick={()=>go(page-1)}>Anterior</button>
      <span className="text-sm opacity-70">Página {page} de {pages}</span>
      <button className="btn" disabled={page>=pages} onClick={()=>go(page+1)}>Siguiente</button>
    </div>
  )
}