import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import { Gem, Circle, Package, Sparkles } from 'lucide-react'

const categoryIcons = {
  'collares': Gem,
  'aretes': Circle,
  'pulseras': Sparkles,
  'sets': Package,
}

const categoryDescriptions = {
  'collares': 'Elegantes diseños para tu cuello',
  'aretes': 'Toques de brillo para tus oídos',
  'pulseras': 'Estilo en tu muñeca',
  'sets': 'Combinaciones perfectas',
}

export default function FeaturedCategories() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.categories.list(),
  })

  const featuredCategories = ['collares', 'aretes', 'pulseras', 'sets']

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-light text-gray-900 mb-4">Explora por categorías</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-2xl p-8 animate-pulse" />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
            Explora por
            <span className="block font-semibold text-[#C9A86C]">categorías</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Encuentra la pieza perfecta para cada ocasión
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featuredCategories.map((slug) => {
            const category = categories?.find((cat: any) => cat.slug === slug)
            const Icon = categoryIcons[slug as keyof typeof categoryIcons]
            
            return (
              <Link
                key={slug}
                to={`/?category=${slug}`}
                className="group relative bg-gradient-to-br from-[#faf7f2] to-white border border-gray-100 rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-[#C9A86C]/30"
              >
                {/* Icon */}
                <div className="w-16 h-16 bg-[#C9A86C]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#C9A86C]/20 transition-colors">
                  <Icon className="w-8 h-8 text-[#C9A86C]" />
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 capitalize">
                    {category?.name || slug}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {categoryDescriptions[slug as keyof typeof categoryDescriptions]}
                  </p>
                  {category?.count && (
                    <span className="text-xs text-[#C9A86C] font-medium">
                      {category.count} productos
                    </span>
                  )}
                </div>

                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#C9A86C]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            )
          })}
        </div>

        {/* View all link */}
        <div className="text-center mt-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[#C9A86C] hover:text-[#b89559] font-medium transition-colors"
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