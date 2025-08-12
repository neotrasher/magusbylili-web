import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
export function useQueryParams(){
  const nav = useNavigate();
  const { search, pathname } = useLocation();
  const params = useMemo(()=> new URLSearchParams(search), [search])
  const set = (k:string,v:string)=>{ const p=new URLSearchParams(search); v? p.set(k,v): p.delete(k); nav({ pathname, search: p.toString() }) }
  return { params, set }
}