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
  itemCount: () => number
  isEmpty: () => boolean
  hasItem: (id: string) => boolean
  getItemQty: (id: string) => number
}

export const useCart = create<CartState>()(persist((set,get)=>({
  items: [],
  add: (p, qty=1) => {
    try {
      set(s=>{
        const i = s.items.findIndex(x=>x.product._id===p._id)
        if (i>=0) { const n=[...s.items]; n[i]={...n[i], qty: n[i].qty+qty}; return {items:n} }
        return { items: [...s.items, { product: p, qty }] }
      })
    } catch (error) {
      console.error('Error adding item to cart:', error)
      throw new Error('No se pudo añadir el producto al carrito')
    }
  },
  remove: (id) => {
    try {
      set(s=>({ items: s.items.filter(x=>x.product._id!==id) }))
    } catch (error) {
      console.error('Error removing item from cart:', error)
      throw new Error('No se pudo eliminar el producto del carrito')
    }
  },
  setQty: (id, qty) => {
    try {
      if (qty < 1) throw new Error('La cantidad debe ser mayor a 0')
      set(s=>({ items: s.items.map(x=>x.product._id===id?{...x, qty}:x) }))
    } catch (error) {
      console.error('Error setting quantity:', error)
      throw new Error('No se pudo actualizar la cantidad')
    }
  },
  clear: () => {
    try {
      set({ items: [] })
    } catch (error) {
      console.error('Error clearing cart:', error)
      throw new Error('No se pudo vaciar el carrito')
    }
  },
  total: () => get().items.reduce((sum,x)=> sum + x.product.price * x.qty, 0),
  itemCount: () => get().items.reduce((sum,x)=> sum + x.qty, 0),
  isEmpty: () => get().items.length === 0,
  hasItem: (id) => get().items.some(x=>x.product._id===id),
  getItemQty: (id) => get().items.find(x=>x.product._id===id)?.qty || 0
}), { name: 'cart-v1' }))