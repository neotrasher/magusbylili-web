import { Link } from 'react-router-dom'
import type { Product } from '../types'
import { useCart } from '../store/cart'
import Badge from './Badge'
import { isBestSeller, isNew } from '../lib/product-helpers'
import WishlistButton from './WishlistButton'
import { useReveal } from '../hooks/useReveal'

export default function ProductCard({p, index=0}:{p:Product; index?:number}){
  const add = useCart(s=>s.add)
  const ref = useReveal((index%8)*30) // pequeño stagger

  return (
    <div ref={ref} className="group relative overflow-hidden rounded-2xl border bg-white">
      <Link to={`/product/${p._id}`}>
        <div className="aspect-[4/5] bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
          {p.thumbnails?.[0] && (
            <img
              src={p.thumbnails[0]}
              alt={p.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              loading="lazy"
            />
          )}
        </div>
      </Link>

      {/* Badges + Wishlist */}
      <div className="absolute left-3 top-3 flex gap-2">
        {isNew(p) && <Badge>Nuevo</Badge>}
        {isBestSeller(p) && <Badge>+ Vendido</Badge>}
      </div>
      <div className="absolute right-3 top-3">
        <WishlistButton id={p._id} />
      </div>

      <div className="p-4">
        <Link to={`/product/${p._id}`} className="block">
          <h3 className="font-medium text-md-fluid line-clamp-1">{p.title}</h3>
          <p className="text-sm-fluid opacity-80">${p.price.toLocaleString('es-CO')}</p>
        </Link>
        <button onClick={()=>add(p,1)} className="btn w-full mt-3">
          Añadir al carrito
        </button>
      </div>
    </div>
  )
}
