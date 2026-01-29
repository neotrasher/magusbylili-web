import { HandHeart, Gem, Truck, Shield, Heart } from 'lucide-react'

const benefits = [
  {
    icon: HandHeart,
    title: 'Hecho a mano',
    description: 'Cada pieza es única y creada con dedicación',
  },
  {
    icon: Gem,
    title: 'Cuentas Miyuki',
    description: 'Calidad premium de Japón en cada diseño',
  },
  {
    icon: Truck,
    title: 'Envío gratis',
    description: 'En pedidos mayores a $120.000',
  },
  {
    icon: Shield,
    title: 'Garantía de calidad',
    description: '100% satisfección o devolución',
  },
]

export default function Benefits() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
            Por qué elegir
            <span className="block font-semibold text-[#C9A86C]">Magus By Lili</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Compromiso con la calidad y el detalle en cada creación
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <div 
                key={index}
                className="text-center group"
              >
                {/* Icon */}
                <div className="w-16 h-16 bg-[#C9A86C]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-[#C9A86C]/20 transition-colors duration-300">
                  <Icon className="w-8 h-8 text-[#C9A86C]" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#C9A86C] to-[#b89559] text-white px-8 py-4 rounded-2xl">
            <Heart className="w-5 h-5" />
            <span className="font-medium">Hecho con amor para ti</span>
          </div>
        </div>
      </div>
    </section>
  )
}