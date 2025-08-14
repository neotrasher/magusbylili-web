// src/components/FreeShippingBar.tsx
import { useCart } from "../store/cart"

const THRESHOLD = 120000 // COP

export default function FreeShippingBar(){
  // 👇 selecciono un número: re-rendera cada vez que cambian items/qty
  const total = useCart(s => s.items.reduce((sum,i)=> sum + i.product.price * i.qty, 0))

  const left = Math.max(0, THRESHOLD - total)
  const done = left === 0
  const pct  = Math.min(100, Math.round((total/THRESHOLD) * 100))

  return (
    // altura estable: NO desmontamos nunca el nodo, así no hay CLS
    <div className="min-h-[44px] bg-[hsl(var(--brand-50))] border-b">
      <div className="container mx-auto px-4 py-2 text-xs md:text-sm flex items-center gap-3">
        <div className="flex-1">
          {done ? (
            <span>🎉 ¡Tienes <strong>envío gratis</strong>!</span>
          ) : (
            <span>Te faltan <strong>${left.toLocaleString('es-CO')}</strong> para envío gratis</span>
          )}
          <div className="mt-2 h-1.5 rounded-full bg-white/70 overflow-hidden">
            <div className="h-full bg-[hsl(var(--gold-500))]" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>
    </div>
  )
}
