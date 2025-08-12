import { create } from 'zustand'

type User = { _id: string; name: string; email: string } | null

export const useAuth = create<{ user: User; setUser:(u:User)=>void; logout:()=>void }>(set=>({
  user: null,
  setUser: (u)=> set({ user: u }),
  logout: ()=> set({ user: null })
}))