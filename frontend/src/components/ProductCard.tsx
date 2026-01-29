import { Link } from 'react-router-dom'
import type { Product } from '../types'
import { useCart } from '../store/cart'
import Badge from './Badge'
import { isBestSeller, isNew } from '../lib/product-helpers'
import WishlistButton from './WishlistButton'
import { useReveal } from '../hooks/useReveal'
import { useEffect, useMemo, useState } from 'react'


export default function ProductCard({p, index=0}:{p:Product; index?:number}){
  const add = useCart(s=>s.add)
  const ref = useReveal((index%8)*30) // pequeño stagger

  const gallery = useMemo(() => (p.thumbnails?.length ? p.thumbnails : [p.image || '/hero-placeholder.png']), [p])
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (gallery.length < 2) return
    const mq = window.matchMedia('(max-width: 768px)')
    if (!mq.matches) return
    const id = window.setInterval(() => {
      setActive((n) => (n + 1) % gallery.length)
    }, 3200)
    return () => window.clearInterval(id)
  }, [gallery.length])

  return (
    <div ref={ref} className="group relative overflow-hidden rounded-2xl border bg-white">
      <Link to={`/product/${p._id}`}>
        <div className="relative aspect-[4/5] bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
          <img
            src={gallery[active]}
            alt={p.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
            decoding="async"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            fetchpriority={index < 2 ? "high" : "auto"}
          />
          {gallery[1] && (
            <img
              src={gallery[1]}
              alt={`${p.title} alternativo`}
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-[1.05]"
              loading="lazy"
              decoding="async"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
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
 <button 
          onClick={(e) => {
            e.preventDefault();
            add(p, 1);
            const button = e.currentTarget;
            button.classList.add('bg-green-500', 'text-white');
            button.textContent = '✓ Añadido';
            window.setTimeout(() => {
              button.classList.remove('bg-green-500', 'text-white');
              button.textContent = 'Añadir al carrito';
            }, 1000);
          }}
          className="btn w-full mt-3 transition-all duration-200 hover:scale-105"
        >
          Añadir al carrito
        </button>

      </div>
    </div>
  )
}
