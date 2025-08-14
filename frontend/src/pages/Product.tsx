import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { useCart } from "../store/cart";
import { useState } from "react";
import Badge from "../components/Badge";
import { isBestSeller, isNew } from "../lib/product-helpers";

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

  if (isLoading) return <p>Cargando…</p>;
  if (error || !p) return <p>Error al cargar</p>;

  const thumbs = p.thumbnails?.length ? p.thumbnails : [undefined];

  return (
    <article className="grid md:grid-cols-2 gap-8">
      {/* Galería */}
      <div className="space-y-3">
        <div className="aspect-square rounded-2xl overflow-hidden border bg-neutral-100 dark:bg-neutral-900">
          {thumbs[current] && (
            <img
              src={thumbs[current]}
              alt={p.title}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        {thumbs.length > 1 && (
          <div className="grid grid-cols-5 gap-2">
            {thumbs.map((t: string | undefined, i: number) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`aspect-square rounded-xl overflow-hidden border ${
                  current === i ? "ring-2 ring-[hsl(var(--brand-500))]" : ""
                }`}
              >
                {t && <img src={t} className="w-full h-full object-cover" />}
              </button>
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
    </article>
  );
}
