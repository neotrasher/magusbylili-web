import { create } from 'zustand'
import type { User } from '../types'

type UserState = User | null

export const useAuth = create<{ user: UserState; setUser:(u:UserState)=>void; logout:()=>void }>(set=>({
  user: null,
  setUser: (u)=> set({ user: u }),
  logout: ()=> set({ user: null })
}))
