import { Link, NavLink } from "react-router-dom";
import { useCart } from "../store/cart";
import { useEffect, useState } from "react";
import CartSheet from "./CartSheet";
import SearchPanel from "./SearchPanel";
import { Search, ShoppingBag } from "lucide-react";

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

  // Cmd/Ctrl + K → abre/cierra panel
  useEffect(()=>{
    const onKey=(e:KeyboardEvent)=>{
      if((e.ctrlKey||e.metaKey) && e.key.toLowerCase()==="k"){ e.preventDefault(); setOpenSearch(v=>!v); }
      if(e.key==="Escape"){ setOpenSearch(false); }
    };
    window.addEventListener("keydown", onKey);
    return ()=> window.removeEventListener("keydown", onKey);
  },[]);

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo-magus.png" alt="Magus By Lili" className="h-8 w-auto"/>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          {CATS.map(c=>(
            <NavLink key={c.slug} to={`/?category=${c.slug}`}
              className={({isActive})=> isActive? "font-medium":"opacity-80 hover:opacity-100"}>
              {c.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={()=>setOpenSearch(v=>!v)}
            aria-label="Buscar"
            className="p-2 rounded-lg border hover:bg-[hsl(var(--brand-50))] transition"
            title="Buscar (Ctrl/⌘+K)"
          >
            <Search size={18} />
          </button>
          <button
            onClick={()=>setOpenCart(true)}
            className="relative p-2 rounded-lg border hover:bg-[hsl(var(--brand-50))] transition"
            aria-label="Carrito"
          >
            <ShoppingBag size={18} />
            {count>0 && (
              <span className="absolute -top-1 -right-1 text-[10px] bg-black text-white rounded-full px-1.5 py-[1px]">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Overlays */}
      <CartSheet open={openCart} onClose={()=>setOpenCart(false)} />
      <SearchPanel open={openSearch} onClose={()=>setOpenSearch(false)} />
    </header>
  );
}
