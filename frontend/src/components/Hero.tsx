export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-2xl border">
      <img
        src="/hero-placeholder.png"
        alt="Accesorios Miyuki"
        className="w-full h-[44vh] md:h-[56vh] object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      <div className="absolute bottom-6 left-6 right-6 md:left-10 text-white">
        <h2 className="font-display text-2xl-fluid md:text-[clamp(2.4rem,3vw,3.2rem)] font-semibold">
          Accesorios Miyuki hechos a mano
        </h2>
        <p className="mt-2 text-white/90 max-w-xl">
          Diseños únicos, calidad japonesa y acabados premium.
        </p>
        <a href="#catalogo" className="btn btn-primary mt-4">
          Comprar ahora
        </a>
      </div>
    </section>
  );
}
