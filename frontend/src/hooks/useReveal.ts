import { useEffect, useRef } from 'react'
export function useReveal(delay=0){
  const ref = useRef<HTMLDivElement|null>(null)
  useEffect(()=>{
    const el = ref.current
    if(!el) return
    el.style.opacity='0'
    el.style.transform='translateY(8px)'
    const io = new IntersectionObserver(([e])=>{
      if(e.isIntersecting){
        el.style.transition='opacity .45s ease, transform .45s ease'
        el.style.transitionDelay=`${delay}ms`
        el.style.opacity='1'
        el.style.transform='translateY(0)'
        io.disconnect()
      }
    }, { threshold:.12 })
    io.observe(el)
    return ()=> io.disconnect()
  },[delay])
  return ref
}
