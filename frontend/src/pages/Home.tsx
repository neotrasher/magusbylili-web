import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import ProductGrid from '../components/ProductGrid'
import Filters from '../components/Filters'
import { useQueryParams } from '../hooks/useQueryParams'
import Pagination from '../components/Pagination'
import Hero from "../components/Hero";

export default function Home(){
  const { params } = useQueryParams()
  const query = {
    page: Number(params.get('page')||1),
    limit: 12,
    q: params.get('q')||'',
    category: params.get('category')||'',
    sort: params.get('sort')||'-createdAt'
  }
  const { data, isLoading, error } = useQuery({
    queryKey: ['products', query],
    queryFn: ()=> api.products.list(query)
  })

  if (isLoading) return <p>Cargando…</p>
  if (error) return <p>Error: {(error as Error).message}</p>

  return (
    <section className="space-y-6">
      <Hero />
      <h1 className="text-2xl font-semibold">Productos</h1>
      <Filters />
      <ProductGrid items={data!.data} />
      <Pagination page={data!.page} total={data!.total} limit={data!.limit} />
    </section>
  )
}