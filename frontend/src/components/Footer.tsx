export default function Footer() {
  const APP = import.meta.env.VITE_APP_NAME ?? 'MagusByLili'
  return (
    <footer className="border-t mt-10">
      <div className="container mx-auto px-4 py-6 text-sm opacity-80 flex flex-wrap gap-2">
        <span>{APP}</span>
        <span>· Hecho con 💗</span>
      </div>
    </footer>
  )
}
