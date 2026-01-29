import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import ProductGrid from "../components/ProductGrid";
import Filters from "../components/Filters";
import { useQueryParams } from "../hooks/useQueryParams";
import Hero from "../components/Hero";
import FeaturedCategories from "../components/FeaturedCategories";
import BestSellers from "../components/BestSellers";
import Benefits from "../components/Benefits";
import FinalCTA from "../components/FinalCTA";
import { Skeleton } from "../components/Skeleton";
import { useSeo } from "../lib/seo";

export default function Home() {
  const { params } = useQueryParams();
  const query = {
    page: Number(params.get("page") || 1),
    limit: 12,
    q: params.get("q") || "",
    category: params.get("category") || "",
    sort: params.get("sort") || "-createdAt",
  };

  useSeo({
    title: "Joyeria artesanal",
    description: "Descubre aretes, collares, pulseras y sets unicos hechos a mano en Colombia.",
    canonical: `${import.meta.env.VITE_SITE_URL || window.location.origin}/`
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["products", query],
    queryFn: () => api.products.list(query),
  });

  // Si hay filtros activos, mostrar vista filtrada
  const hasActiveFilters = params.get('category') || params.get('q');

  if (hasActiveFilters) {
    return (
      <div className="min-h-screen">
        <Hero />
        
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl md:text-3xl font-light text-gray-900">
                Resultados de búsqueda
              </h1>
            </div>

            <Filters />

            {isLoading && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="rounded-2xl border p-3 bg-white">
                    <Skeleton className="aspect-[4/5] mb-3" />
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-10 w-full mt-4" />
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div className="text-center py-12">
                <p className="text-gray-500">Error: {(error as Error).message}</p>
              </div>
            )}

            {data && <ProductGrid items={data.data} />}
          </div>
        </section>
      </div>
    );
  }

  // Vista principal de la home
  return (
    <div className="min-h-screen">
      <Hero />
      <FeaturedCategories />
      <BestSellers />
      <Benefits />
      <FinalCTA />
      
      {/* All products section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
              Todos nuestros
              <span className="block font-semibold text-[#C9A86C]">diseños</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explora la colección completa de accesorios únicos
            </p>
          </div>

          <Filters />

          {isLoading && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-2xl border p-3 bg-white">
                  <Skeleton className="aspect-[4/5] mb-3" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-10 w-full mt-4" />
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-gray-500">Error: {(error as Error).message}</p>
            </div>
          )}

          {data && <ProductGrid items={data.data} />}
        </div>
      </section>
    </div>
  );
}
