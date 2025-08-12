import { Link } from 'react-router-dom'
import type { Product } from '../types'
import { useCart } from '../store/cart'
import Price from './Price';

export default function ProductCard({ p }: { p: Product }) {
  const add = useCart(s => s.add)
  return (
    <div className="group rounded-2xl border p-3 hover:shadow-sm transition">
      <Link to={`/product/${p._id}`}>
        <div className="aspect-square rounded-xl bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
          {p.thumbnails?.[0] ? (
            <img src={p.thumbnails[0]} alt={p.title} className="w-full h-full object-cover" />
          ) : null}
        </div>
        <h3 className="mt-3 line-clamp-1 font-medium">{p.title}</h3>
        <Price value={p.price} className="text-sm opacity-80" />
      </Link>
      <button
        onClick={() => add(p, 1)}
        className="mt-3 w-full rounded-xl py-2 border"
      >
        Añadir
      </button>
    </div>
  )
}
