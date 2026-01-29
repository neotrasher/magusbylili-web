import { ArrowDown, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-[#faf7f2] via-white to-[#f5f5f5] overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='7'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-[#C9A86C]/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-[#C9A86C]/5 rounded-full blur-2xl animate-pulse delay-1000" />
      
      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-[#C9A86C]/10 text-[#C9A86C] px-4 py-2 rounded-full text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4" />
          Colección 2025
        </div>

        {/* Main heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-gray-900 mb-6 leading-tight">
          Joyas
          <span className="block font-semibold text-[#C9A86C]">Hechas a mano</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Descubre accesorios únicos creados con cuentas Miyuki de Japón. 
          <span className="block text-[#C9A86C] font-medium">Diseños que cuentan tu historia.</span>
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link 
            to="/?category=collares"
            className="bg-[#C9A86C] hover:bg-[#b89559] text-white px-8 py-4 rounded-2xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            Ver Colección
          </Link>
          <Link 
            to="/?category=sets"
            className="border-2 border-[#C9A86C] text-[#C9A86C] hover:bg-[#C9A86C] hover:text-white px-8 py-4 rounded-2xl font-medium transition-all duration-300"
          >
            Sets Exclusivos
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#C9A86C]">100+</div>
            <div className="text-sm text-gray-500">Diseños</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#C9A86C]">Hecho</div>
            <div className="text-sm text-gray-500">a mano</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#C9A86C]">Premium</div>
            <div className="text-sm text-gray-500">calidad</div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ArrowDown className="w-5 h-5 text-gray-400" />
      </div>
    </section>
  );
}
