// src/components/CartSheet.tsx
import { useCart } from '../store/cart'
import Price from './Price'

export default function CartSheet({ open, onClose }:{ open:boolean; onClose:()=>void }){
  const { items, setQty, remove, total, clear } = useCart()

  return (
    <div className={`fixed inset-0 z-[100] ${open? 'pointer-events-auto' : 'pointer-events-none'}`}>
      {/* backdrop */}
      <div onClick={onClose}
           className={`absolute inset-0 transition ${open? 'bg-black/30 opacity-100' : 'opacity-0'}`} />

      {/* panel */}
      <aside className={`absolute right-0 top-0 h-[var(--dvh)] w-full max-w-md bg-white dark:bg-neutral-950
                         shadow-xl flex flex-col transition-transform ${open? 'translate-x-0' : 'translate-x-full'}`}>

        {/* header */}
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">Tu carrito</h3>
          <button onClick={onClose} className="btn">Cerrar</button>
        </div>

        {/* contenido scrollable */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length===0 && <p className="opacity-70">Vacío por ahora.</p>}
          {items.map(({product, qty})=> (
            <div key={product._id} className="flex gap-3 items-center">
              <img src={product.thumbnails?.[0]} className="w-16 h-16 rounded-xl object-cover bg-neutral-100"/>
              <div className="flex-1">
                <p className="font-medium line-clamp-1">{product.title}</p>
                <Price value={product.price} className="text-sm opacity-80"/>
              </div>
              <input type="number" min={1} value={qty}
                     onChange={e=>setQty(product._id, Math.max(1, Number(e.target.value)||1))}
                     className="w-16 border rounded-lg px-2 py-1"/>
              <button onClick={()=>remove(product._id)} className="text-sm underline">Quitar</button>
            </div>
          ))}
        </div>

        {/* footer fijo dentro del drawer */}
        <div className="border-t bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span>Total</span>
              <Price value={total()} />
            </div>
            <div className="flex gap-2">
              <button onClick={clear} className="btn flex-1">Vaciar</button>
              <a href="/checkout" className="btn flex-1 text-center">Ir a pagar</a>
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}
