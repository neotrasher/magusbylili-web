import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '../types'

type CartItem = { product: Product; qty: number }

type CartState = {
  items: CartItem[]
  add: (p: Product, qty?: number) => void
  remove: (id: string) => void
  setQty: (id: string, qty: number) => void
  clear: () => void
  total: () => number
}

export const useCart = create<CartState>()(persist((set,get)=>({
  items: [],
  add: (p, qty=1) => set(s=>{
    const i = s.items.findIndex(x=>x.product._id===p._id)
    if (i>=0) { const n=[...s.items]; n[i]={...n[i], qty: n[i].qty+qty}; return {items:n} }
    return { items: [...s.items, { product: p, qty }] }
  }),
  remove: (id) => set(s=>({ items: s.items.filter(x=>x.product._id!==id) })),
  setQty: (id, qty) => set(s=>({ items: s.items.map(x=>x.product._id===id?{...x, qty}:x) })),
  clear: () => set({ items: [] }),
  total: () => get().items.reduce((sum,x)=> sum + x.product.price * x.qty, 0)
}), { name: 'cart-v1' }))