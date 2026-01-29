import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import ProductCard from './ProductCard'
import { Link } from 'react-router-dom'
import { Star, TrendingUp } from 'lucide-react'

export default function BestSellers() {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['best-sellers'],
    queryFn: () => api.products.list({ limit: 8, sort: '-sold' }),
  })

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">Los más vendidos</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
                <div className="aspect-[4/5] bg-gray-200 rounded-xl mb-4" />
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-3 bg-gray-200 rounded w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error || !products?.data?.length) {
    return null
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#C9A86C]/10 text-[#C9A86C] px-4 py-2 rounded-full text-sm font-medium mb-4">
            <TrendingUp className="w-4 h-4" />
            Trending
          </div>
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
            Los más
            <span className="block font-semibold text-[#C9A86C]">vendidos</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Las piezas favoritas de nuestras clientas
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {products.data.slice(0, 8).map((product: any, index: number) => (
            <div key={product._id} className="relative group">
              {/* Best seller badge */}
              <div className="absolute top-3 left-3 z-10">
                <div className="bg-[#C9A86C] text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  Top
                </div>
              </div>
              
              <ProductCard p={product} index={index} />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to="/?sort=-sold"
            className="inline-flex items-center gap-2 bg-white border-2 border-[#C9A86C] text-[#C9A86C] hover:bg-[#C9A86C] hover:text-white px-8 py-4 rounded-2xl font-medium transition-all duration-300"
          >
            Ver todos los productos
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}