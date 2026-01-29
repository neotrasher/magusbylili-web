import { Link } from 'react-router-dom'
import { Instagram, MessageCircle, Mail } from 'lucide-react'

export default function FinalCTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#C9A86C] to-[#b89559] relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='7' cy='7' r='7'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main message */}
          <h2 className="text-3xl md:text-5xl font-light text-white mb-6 leading-tight">
            ¿Lista para encontrar tu
            <span className="block font-semibold">pieza perfecta?</span>
          </h2>

          <p className="text-lg md:text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            Únete a cientos de clientas que ya descubrieron la magia de nuestros accesorios únicos
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              to="/?category=collares"
              className="bg-white text-[#C9A86C] hover:bg-gray-50 px-8 py-4 rounded-2xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              Comprar ahora
            </Link>
            <Link
              to="/?category=sets"
              className="border-2 border-white text-white hover:bg-white hover:text-[#C9A86C] px-8 py-4 rounded-2xl font-medium transition-all duration-300"
            >
              Ver colección
            </Link>
          </div>

          {/* Social links */}
          <div className="flex items-center justify-center gap-6">
            <a
              href="https://instagram.com/magusbylili"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://wa.me/573001234567"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
            <a
              href="mailto:info@magusbylili.com"
              className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                Envío gratis en compras +$120.000
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                100% hecho a mano
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                Satisfacción garantizada
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}