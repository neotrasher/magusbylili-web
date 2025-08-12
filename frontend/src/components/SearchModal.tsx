import { useEffect, useRef, useState } from "react";
import { api } from "../lib/api";
import { useDebounced } from "../hooks/useDebounced";
import { Link } from "react-router-dom";

type Result = { _id:string; title:string; price:number; thumbnails?:string[]; category?:string };

const mark = (text:string, q:string) => {
  if(!q) return text;
  try{
    const r = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")})`, "ig");
    return text.replace(r, "<mark>$1</mark>");
  }catch{ return text; }
};

export default function SearchModal({open,onClose}:{open:boolean;onClose:()=>void}){
  const [q,setQ] = useState("");
  const debounced = useDebounced(q.trim(), 450);
  const [items,setItems] = useState<Result[]>([]);
  const [loading,setLoading] = useState(false);
  const [ix,setIx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // recientes
  const [recent,setRecent] = useState<string[]>(()=>{ try{return JSON.parse(localStorage.getItem("recent")||"[]")}catch{return []} });
  const pushRecent = (s:string)=>{ const n=[s,...recent.filter(x=>x!==s)].slice(0,6); setRecent(n); localStorage.setItem("recent",JSON.stringify(n)); };

  useEffect(()=>{ if(open) setTimeout(()=>inputRef.current?.focus(),10) },[open]);

  useEffect(()=>{
    if(!open) return;
    if(debounced==="" || debounced.length<3){ setItems([]); setLoading(false); return; }
    setLoading(true);
    api.products.list({ q: debounced, limit: 8, sort: "-createdAt" })
      .then(r=> setItems(r.data as any))
      .finally(()=> setLoading(false));
  },[debounced,open]);

  // teclado
  useEffect(()=>{
    if(!open) return;
    const onKey=(e:KeyboardEvent)=>{
      if(e.key==="Escape") onClose();
      if(e.key==="ArrowDown"){ e.preventDefault(); setIx(i=> Math.min(i+1, Math.max(0, items.length-1))); }
      if(e.key==="ArrowUp"){ e.preventDefault(); setIx(i=> Math.max(i-1, 0)); }
      if(e.key==="Enter"){ const t=items[ix]; if(t){ pushRecent(q); location.href=`/product/${t._id}`; } }
    };
    window.addEventListener("keydown",onKey);
    return ()=> window.removeEventListener("keydown",onKey);
  },[open,items,ix,q]);

  if(!open) return null;

  return (
    <div className="fixed inset-0 z-[120]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}/>
      <div className="absolute inset-x-0 top-10 mx-auto max-w-4xl rounded-2xl bg-white border shadow-xl">
        <div className="p-4 border-b">
          <input ref={inputRef} value={q} onChange={e=>{setQ(e.target.value); setIx(0);}}
                 placeholder="Buscar (min 3 letras)…" className="w-full outline-none text-2xl md:text-3xl bg-transparent"/>
        </div>

        {q.trim()==="" && recent.length>0 && (
          <div className="p-4">
            <p className="subtle text-sm mb-2">Recientes</p>
            <div className="flex gap-2 flex-wrap">{recent.map(s=><button key={s} onClick={()=>setQ(s)} className="chip">{s}</button>)}</div>
          </div>
        )}

        {loading && <div className="p-6 subtle">Buscando…</div>}

        {!loading && debounced.length>=3 && (
          <ul className="max-h-[60vh] overflow-auto divide-y">
            {items.length===0 && <li className="p-6 subtle">Sin resultados para “{debounced}”.</li>}
            {items.map((p,i)=>(
              <li key={p._id} className={`p-3 ${ix===i?'bg-[hsl(var(--brand-50))]':''}`}>
                <Link to={`/product/${p._id}`} onClick={()=>{pushRecent(q); onClose();}} className="flex gap-3 items-center">
                  <img src={p.thumbnails?.[0]} className="w-16 h-16 rounded-xl object-cover bg-neutral-100"/>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium" dangerouslySetInnerHTML={{__html: mark(p.title, debounced)}}/>
                    <div className="subtle text-sm">${p.price.toLocaleString('es-CO')}</div>
                  </div>
                  <span className="subtle text-xs uppercase">{p.category||''}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
