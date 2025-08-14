export default function Badge({children}:{children:React.ReactNode}){
  return (
    <span className="inline-flex items-center rounded-full bg-[hsl(var(--brand-50))] text-[11px] px-2 py-0.5 border">
      {children}
    </span>
  )
}
