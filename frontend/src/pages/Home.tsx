import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import ProductGrid from "../components/ProductGrid";
import Filters from "../components/Filters";
import { useQueryParams } from "../hooks/useQueryParams";
import Hero from "../components/Hero";
import { Skeleton } from "../components/Skeleton";

export default function Home() {
  const { params } = useQueryParams();
  const query = {
    page: Number(params.get("page") || 1),
    limit: 12,
    q: params.get("q") || "",
    category: params.get("category") || "",
    sort: params.get("sort") || "-createdAt",
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["products", query],
    queryFn: () => api.products.list(query),
  });

  return (
    <section className="space-y-6">
      <Hero />

      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl-fluid md:text-2xl font-semibold">
          Productos
        </h1>
      </div>

      <Filters />

      {isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl border p-3">
              <Skeleton className="aspect-[4/5] mb-3" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-10 w-full mt-4" />
            </div>
          ))}
        </div>
      )}

      {error && <p className="opacity-70">Error: {(error as Error).message}</p>}

      {data && <ProductGrid items={data.data} />}
    </section>
  );
}
