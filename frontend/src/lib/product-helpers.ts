export const isNew = (p:any) => {
  const d = p?.createdAt ? new Date(p.createdAt) : null
  if(!d) return false
  const days = (Date.now()-d.getTime())/(1000*60*60*24)
  return days <= 30
}
export const isBestSeller = (p:any) => (p?.sales ?? 0) >= 10
