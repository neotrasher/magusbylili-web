import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type State = {
  ids: string[]
  toggle: (id:string)=>void
  has: (id:string)=>boolean
}
export const useWishlist = create<State>()(persist((set,get)=>({
  ids: [],
  toggle: (id)=> set(s=>{
    const on = s.ids.includes(id)
    return { ids: on ? s.ids.filter(x=>x!==id) : [id, ...s.ids] }
  }),
  has: (id)=> get().ids.includes(id)
}), { name:'wishlist-v1' }))
