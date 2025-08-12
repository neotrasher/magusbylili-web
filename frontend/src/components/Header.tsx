import { Link, NavLink } from "react-router-dom";
import { useCart } from "../store/cart";
import { useEffect, useState } from "react";
import CartSheet from "./CartSheet";
import SearchModal from "./SearchModal";

const CATS = [
  {label:"Aretes", slug:"aretes"},
  {label:"Pulseras", slug:"pulseras"},
  {label:"Collares", slug:"collares"},
  {label:"Sets", slug:"sets"},
  {label:"Patrones", slug:"patrones"},
];

export default function Header(){
  const items = useCart(s=>s.items);
  const count = items.reduce((n,i)=>n+i.qty,0);
  const [openCart,setOpenCart] = useState(false);
  const [openSearch,setOpenSearch] = useState(false);

  // Cmd/Ctrl + K para abrir búsqueda
  useEffect(()=>{
    const onKey=(e:KeyboardEvent)=>{
      if((e.ctrlKey||e.metaKey) && e.key.toLowerCase()==="k"){ e.preventDefault(); setOpenSearch(true); }
    };
    window.addEventListener("keydown", onKey);
    return ()=> window.removeEventListener("keydown", onKey);
  },[]);

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
      {/* Top bar */}
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo-magus.png" alt="Magus By Lili" className="h-8 w-auto"/>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          {CATS.map(c=>(
            <NavLink key={c.slug} to={`/?category=${c.slug}`} className={({isActive})=> isActive? "font-medium":"opacity-80 hover:opacity-100"}>{c.label}</NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button onClick={()=>setOpenSearch(true)} aria-label="Buscar" className="opacity-80 hover:opacity-100">🔍</button>
          <button onClick={()=>setOpenCart(true)} className="relative" aria-label="Carrito">
            🛍️ {count>0 && <span className="absolute -top-2 -right-3 text-xs bg-black text-white rounded-full px-2 py-0.5">{count}</span>}
          </button>
        </div>
      </div>

      {/* Search & Cart */}
      <CartSheet open={openCart} onClose={()=>setOpenCart(false)} />
      <SearchModal open={openSearch} onClose={()=>setOpenSearch(false)} />
    </header>
  );
}
