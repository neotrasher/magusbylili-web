import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import { useCart } from '../store/cart'
import Price from '../components/Price';

export default function Product(){
  const { id } = useParams()
  const add = useCart(s=>s.add)
  const { data, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: ()=> api.products.get(id!)
  })
  if (isLoading) return <p>Cargando…</p>
  if (error) return <p>Error: {(error as Error).message}</p>
  const p = data!
  return (
    <article className="grid md:grid-cols-2 gap-8">
      <div className="aspect-square rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-900">
        {p.thumbnails?.[0] && <img src={p.thumbnails[0]} alt={p.title} className="w-full h-full object-cover"/>}
      </div>
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold">{p.title}</h1>
        <p className="text-lg"><Price value={p.price} /></p>
        <button onClick={()=>add(p,1)} className="rounded-xl py-2 px-4 border">Añadir al carrito</button>
        <p className="opacity-80 text-sm">{p.description}</p>
      </div>
    </article>
  )
}