import { useCart } from '../store/cart'
import Price from './Price'
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Shield, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function CartSheet({ open, onClose }:{ open:boolean; onClose:()=>void }){
  const { items, setQty, remove, total, clear } = useCart()
  const [removingItem, setRemovingItem] = useState<string | null>(null)

  const freeShipping = 120000
  const hasFreeShipping = total() >= freeShipping

  const handleRemove = async (id: string) => {
    setRemovingItem(id)
    setTimeout(() => {
      remove(id)
      setRemovingItem(null)
    }, 200)
  }

  const handleQtyChange = (id: string, newQty: number) => {
    if (newQty < 1) return
    setQty(id, newQty)
  }

  const itemCount = items.reduce((sum, item) => sum + item.qty, 0)
  const isEmpty = items.length === 0

  return (
    <div className={`fixed inset-0 z-[100] ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      <div onClick={onClose}
           className={`absolute inset-0 transition ${open ? 'bg-black/50 opacity-100' : 'opacity-0'}`} />

      <aside className={`absolute right-0 top-0 h-[var(--dvh)] w-full max-w-md bg-white dark:bg-neutral-950
                         shadow-xl flex flex-col transition-transform ${open ? 'translate-x-0' : 'translate-x-full'}`}>

        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#C9A86C]" />
            Tu carrito
            <span className="ml-2 bg-[#C9A86C] text-white text-xs px-2 py-1 rounded-full">
              {itemCount}
            </span>
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8 text-gray-400" />
                </div>
              </div>
              <h3 className="text-xl font-light text-gray-700 mb-2">Tu carrito está vacío</h3>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto">Parece que aún no has agregado productos</p>
              <p className="text-sm text-gray-400 mb-8 max-w-xs mx-auto">Explora nuestra colección de joyas únicas</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map(({product, qty})=> (
                <div key={product._id} className={`flex gap-3 items-center p-3 rounded-lg border border-gray-100 transition-all duration-200 ${
                  removingItem === product._id ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
                }`}>
                  <img 
                    src={product.thumbnails?.[0] || product.image || '/hero-placeholder.png'} 
                    alt={product.title}
                    className="w-16 h-16 rounded-xl object-cover bg-gray-100" 
                    loading="lazy"
                    decoding="async"
                    width={64}
                    height={64}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 dark:text-gray-200 line-clamp-1">{product.title}</p>
                    <Price value={product.price} className="text-sm text-gray-500" />
                  </div>
                  
                  <div className="flex items-center gap-1 bg-gray-100 rounded-lg px-1">
                    <button
                      onClick={() => handleQtyChange(product._id, qty - 1)}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                      disabled={qty <= 1}
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{qty}</span>
                    <button
                      onClick={() => handleQtyChange(product._id, qty + 1)}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => handleRemove(product._id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Subtotal</span>
              <Price value={total()} className="font-medium text-gray-800" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Envío</span>
              {hasFreeShipping ? (
                <span className="font-medium text-green-600">¡Gratis!</span>
              ) : (
                <span className="font-medium text-gray-800">$8,000</span>
              )}
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-800">Total</span>
                <div>
                  <Price value={total()} className="text-xl font-bold text-[#C9A86C]" />
                  {!hasFreeShipping && (
                    <div className="text-xs text-gray-500 mt-1">+ $8,000 envío</div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={clear} className="w-full border border-gray-200 text-gray-700 hover:bg-gray-50 py-3 rounded-xl font-medium transition-colors">
                Vaciar carrito
              </button>
              <Link 
                to="/checkout" 
                onClick={onClose}
                className="block w-full bg-[#C9A86C] hover:bg-[#b89559] text-white py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-[1.02] text-center"
              >
                Procesar pedido
                <ArrowRight className="w-5 h-5 inline-block ml-2" />
              </Link>
            </div>

            <div className="flex items-center justify-center gap-6 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Pago seguro</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Envío rápido</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}