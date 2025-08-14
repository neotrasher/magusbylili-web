import { useWishlist } from '../store/wishlist'

export default function WishlistButton({ id, size=36 }:{ id:string; size?:number }){
  const has = useWishlist(s=>s.has(id))
  const toggle = useWishlist(s=>s.toggle)
  return (
    <button
      onClick={()=>toggle(id)}
      aria-pressed={has}
      className={`rounded-full border bg-white/80 backdrop-blur transition
        hover:scale-105 active:scale-95`}
      style={{ width:size, height:size }}
      title={has? 'Quitar de favoritos':'Añadir a favoritos'}
    >
      <svg viewBox="0 0 24 24" width={size-14} height={size-14} className="mx-auto"
           fill={has? 'currentColor':'none'} stroke="currentColor" strokeWidth="1.5">
        <path d="M12 21s-6.716-4.26-9.428-7.64C.819 11.19 1.12 8.6 2.93 7.02A5.45 5.45 0 0 1 6.5 6c1.62.14 3.03.98 3.86 2.28A5.01 5.01 0 0 1 14.22 6c1.5-.08 3 .54 3.98 1.75 1.7 1.98 1.43 4.95-.1 6.74C18.02 16.26 12 21 12 21Z"/>
      </svg>
    </button>
  )
}
