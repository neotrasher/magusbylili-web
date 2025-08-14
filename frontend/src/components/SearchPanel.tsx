import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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

export default function SearchPanel({open,onClose}:{open:boolean;onClose:()=>void}){
  const [q,setQ] = useState("");
  const debounced = useDebounced(q.trim(), 400);
  const [items,setItems] = useState<Result[]>([]);
  const [loading,setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [recent,setRecent] = useState<string[]>(()=>{ try{return JSON.parse(localStorage.getItem("recent")||"[]")}catch{return []} });
  const pushRecent = (s:string)=>{ const n=[s,...recent.filter(x=>x!==s)].slice(0,6); setRecent(n); localStorage.setItem("recent",JSON.stringify(n)); };

  // focus + body lock suave
  useEffect(()=>{
    if(!open) return;
    setTimeout(()=>inputRef.current?.focus(),10);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return ()=>{ document.body.style.overflow = prev; };
  },[open]);

  // fetch
  useEffect(()=>{
    if(!open) return;
    if(debounced==="" || debounced.length<3){ setItems([]); setLoading(false); return; }
    setLoading(true);
    api.products.list({ q: debounced, limit: 8, sort: "-createdAt" })
      .then(r=> setItems(r.data as any))
      .finally(()=> setLoading(false));
  },[debounced,open]);

  // ESC
  useEffect(()=>{
    if(!open) return;
    const onKey=(e:KeyboardEvent)=>{ if(e.key==="Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return ()=> window.removeEventListener("keydown", onKey);
  },[open,onClose]);

  if(!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] bg-black/25"
      onPointerDown={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="
          pointer-events-auto mx-auto w-[calc(100vw-16px)] md:w-[min(92vw,720px)]
          mt-[max(16px,env(safe-area-inset-top))] rounded-2xl border bg-white shadow-xl overflow-hidden
        "
        onPointerDown={(e)=>e.stopPropagation()}  // evita cerrar al tocar dentro
      >
        <div className="p-3 md:p-4 border-b">
          <input
            ref={inputRef}
            value={q}
            onChange={e=>setQ(e.target.value)}
            placeholder="Buscar productos…"
            className="w-full outline-none text-sm-fluid md:text-md-fluid bg-transparent"
          />
          <p className="hidden md:block text-[11px] text-black/50 mt-1">
            Enter abre · Esc cierra · Ctrl/⌘+K
          </p>
        </div>

        {q.trim()==="" && recent.length>0 && (
          <div className="p-3 md:p-4">
            <p className="text-xs text-black/50 mb-2">Recientes</p>
            <div className="flex gap-2 flex-wrap">
              {recent.map(s=>(
                <button key={s} onClick={()=>setQ(s)} className="chip">{s}</button>
              ))}
            </div>
          </div>
        )}

        {loading && <div className="p-4 text-black/60">Buscando…</div>}

        {!loading && debounced.length>=3 && (
          <ul className="max-h-[70dvh] overflow-auto divide-y">
            {items.length===0 && <li className="p-4 text-black/60">Sin resultados para “{debounced}”.</li>}
            {items.map(p=>(
              <li key={p._id} className="p-3 md:p-4 hover:bg-[hsl(var(--brand-50))]/50">
                <Link
                  to={`/product/${p._id}`}
                  onClick={()=>{ pushRecent(q); onClose(); }}
                  className="flex gap-3 items-center"
                >
                  <img
                    src={p.thumbnails?.[0]}
                    className="w-14 h-14 md:w-16 md:h-16 rounded-lg object-cover bg-neutral-100 shrink-0"
                    alt=""
                  />
                  <div className="flex-1 min-w-0">
                    <div
                      className="font-medium text-sm-fluid md:text-md-fluid truncate"
                      dangerouslySetInnerHTML={{__html: mark(p.title, debounced)}}
                    />
                    <div className="text-xs-fluid md:text-sm text-black/60">${p.price.toLocaleString('es-CO')}</div>
                  </div>
                  {p.category && (
                    <span className="hidden md:block text-[11px] text-black/45 uppercase shrink-0">
                      {p.category}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>,
    document.body
  );
}
