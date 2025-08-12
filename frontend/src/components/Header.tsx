import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../store/cart'
import { useState } from 'react'
import CartSheet from './CartSheet'

export default function Header(){
  const items = useCart(s=>s.items)
  const count = items.reduce((n,i)=>n+i.qty,0)
  const [open,setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-black/40 border-b border-[hsl(var(--border))]">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="font-semibold text-lg tracking-tight">{import.meta.env.VITE_APP_NAME}</Link>
        <nav className="flex items-center gap-6 text-sm">
          <NavLink to="/" className={({isActive})=> isActive? 'font-medium':'opacity-80 hover:opacity-100'}>Tienda</NavLink>
          <NavLink to="/account" className={({isActive})=> isActive? 'font-medium':'opacity-80 hover:opacity-100'}>Cuenta</NavLink>
          <button onClick={()=>setOpen(true)} className="relative">
            Carrito
            {count>0 && <span className="absolute -top-2 -right-3 text-xs bg-black text-white dark:bg-white dark:text-black rounded-full px-2 py-0.5">{count}</span>}
          </button>
        </nav>
      </div>
      <CartSheet open={open} onClose={()=>setOpen(false)}/>
    </header>
  )
}