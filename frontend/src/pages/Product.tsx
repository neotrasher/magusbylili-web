import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { useCart } from "../store/cart";
import { useEffect, useRef, useState } from "react";

import Badge from "../components/Badge";
import { isBestSeller, isNew } from "../lib/product-helpers";
import { useSeo } from "../lib/seo";

export default function Product() {


  const { id } = useParams();
  const add = useCart((s) => s.add);
  const {
    data: p,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => api.products.get(id!),
  });

  const [current, setCurrent] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragStart = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);
  const touchStart = useRef<number | null>(null);
  const touchEnd = useRef<number | null>(null);

  const baseUrl = import.meta.env.VITE_SITE_URL || window.location.origin;

  useSeo({
    title: p?.title || "Producto",
    description: p?.description || "Joyeria artesanal con disenos unicos.",
    image: p?.thumbnails?.[0] || p?.image || "/logo-magus.png",
    canonical: `${baseUrl}/product/${p?._id || id || ""}`,
  });

  const thumbs = p?.thumbnails?.length
    ? p.thumbnails
    : [p?.image || "/hero-placeholder.png"];

  const total = thumbs.length;
  const goNext = () => setCurrent((c) => (c + 1) % total);
  const goPrev = () => setCurrent((c) => (c - 1 + total) % total);

  useEffect(() => {
    if (!p || total <= 1 || zoomOpen) return;
    const intervalId = window.setInterval(goNext, 4200);
    return () => window.clearInterval(intervalId);
  }, [p, total, zoomOpen]);

  function onTouchStart(e: React.TouchEvent) {
    touchEnd.current = null;
    touchStart.current = e.targetTouches[0].clientX;
  }

  function onTouchMove(e: React.TouchEvent) {
    touchEnd.current = e.targetTouches[0].clientX;
  }

  function onTouchEnd() {
    if (touchStart.current === null || touchEnd.current === null) return;
    const distance = touchStart.current - touchEnd.current;
    if (Math.abs(distance) < 45) return;
    if (distance > 0) goNext();
    if (distance < 0) goPrev();
  }

  function startDrag(e: React.PointerEvent<HTMLDivElement>) {
    if (!zoomed) return;
    dragStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
  }

  function onDrag(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragStart.current || !zoomed) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setPan({ x: dragStart.current.panX + dx, y: dragStart.current.panY + dy });
  }

  function endDrag() {
    dragStart.current = null;
  }

  if (isLoading) return <p>Cargando…</p>;
  if (error || !p) return <p>Error al cargar</p>;

  return (
    <article className="grid md:grid-cols-2 gap-8">

      {/* Galería */}
      <div className="space-y-3">
        <div
          className="relative aspect-square rounded-2xl overflow-hidden border bg-neutral-100 dark:bg-neutral-900"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div
            className="flex h-full transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {thumbs.map((t, i) => (
              <div key={i} className="h-full w-full flex-shrink-0">
                {t && (
                  <button
                    type="button"
                    className="h-full w-full"
                    onClick={() => {
                      setZoomOpen(true);
                      setZoomed(false);
                    }}
                    aria-label="Abrir zoom de imagen"
                  >
                    <img
                      src={t}
                      alt={p.title}
                      className="h-full w-full object-cover"
                      loading={i === 0 ? "eager" : "lazy"}
                      decoding="async"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      fetchpriority={i === 0 ? "high" : "auto"}
                    />
                  </button>
                )}
              </div>
            ))}
          </div>
          {total > 1 && (
            <>
              <button
                type="button"
                onClick={goPrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border bg-white/80 px-3 py-2 text-sm shadow-sm backdrop-blur"
                aria-label="Imagen anterior"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={goNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border bg-white/80 px-3 py-2 text-sm shadow-sm backdrop-blur"
                aria-label="Imagen siguiente"
              >
                ›
              </button>
            </>
          )}
        </div>
        {total > 1 && (
          <div className="flex items-center gap-2">
            {thumbs.map((t, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2.5 w-2.5 rounded-full border transition ${
                  current === i ? "bg-[hsl(var(--brand-500))]" : "bg-white"
                }`}
                aria-label={`Ir a imagen ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>


      {/* Info */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          {isNew(p) && <Badge>Nuevo</Badge>}
          {isBestSeller(p) && <Badge>+ Vendido</Badge>}
          {p.category && <Badge>{p.category}</Badge>}
        </div>

        <h1 className="text-3xl font-display">{p.title}</h1>
        <p className="text-xl">${p.price.toLocaleString("es-CO")}</p>

        {p.description && (
          <p className="opacity-80 leading-relaxed">{p.description}</p>
        )}

        {/* CTA sticky en móvil */}
        <div className="hidden md:block">
          <button onClick={() => add(p, 1)} className="btn btn-primary w-full">
            Añadir al carrito
          </button>
        </div>
      </div>

      {/* Sticky bar (móvil) */}
      <div className="fixed inset-x-0 bottom-0 z-40 bg-white/90 backdrop-blur border-t p-3 md:hidden">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-sm opacity-70 line-clamp-1">{p.title}</p>
            <p className="font-medium">${p.price.toLocaleString("es-CO")}</p>
          </div>
          <button onClick={() => add(p, 1)} className="btn btn-primary">
            Añadir
          </button>
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            name: p.title,
            image: p.thumbnails || [],
            description: p.description || "",
            offers: {
              "@type": "Offer",
              priceCurrency: "COP",
              price: p.price,
              availability: "https://schema.org/InStock",
              url: typeof window !== "undefined" ? window.location.href : "",
            },
          }),
        }}
      />

      {zoomOpen && (
        <div
          className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => {
            setZoomOpen(false);
            setZoomed(false);
          }}
        >
          <div
            className="relative w-full max-w-5xl h-[80vh] rounded-3xl bg-neutral-950/80 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => {
                setZoomOpen(false);
                setZoomed(false);
                setPan({ x: 0, y: 0 });
              }}
              className="absolute right-4 top-4 z-10 rounded-full bg-white/90 px-3 py-1 text-sm"
            >
              Cerrar
            </button>
            <div
              className="relative h-full w-full"
              onPointerDown={startDrag}
              onPointerMove={onDrag}
              onPointerUp={endDrag}
              onPointerLeave={endDrag}
              onClick={() => {
                setZoomed((v) => !v);
                if (zoomed) setPan({ x: 0, y: 0 });
              }}
            >
              <div
                className="h-full w-full transition-transform duration-500"
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomed ? 1.35 : 1})`,
                  cursor: zoomed ? "grab" : "zoom-in",
                }}
              >
                <img
                  src={thumbs[current]}
                  alt={p.title}
                  className="h-full w-full object-contain"
                  decoding="async"
                />
              </div>
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/80">
              {zoomed ? "Arrastra para mover" : "Toca para acercar"}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

