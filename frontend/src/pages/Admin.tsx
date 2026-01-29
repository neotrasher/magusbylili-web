import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { toast } from "sonner";
import { api } from "../lib/api";
import { storage } from "../lib/firebase";
import { useAuth } from "../store/auth";
import { useSeo } from "../lib/seo";
import type { Order, Product } from "../types";

type Tab = "products" | "orders";

type ProductFormState = {
  title: string;
  description: string;
  price: string;
  stock: string;
  category: string;
  thumbnails: string;
};

type ImagePreview = {
  url: string;
  name: string;
  path?: string;
  source: "upload" | "existing";
};

const emptyForm: ProductFormState = {
  title: "",
  description: "",
  price: "",
  stock: "",
  category: "",
  thumbnails: "",
};

const statusOptions = ["pending", "paid", "processing", "shipped", "delivered", "cancelled"];

export default function Admin() {
  const user = useAuth((s) => s.user);
  const setUser = useAuth((s) => s.setUser);
  const qc = useQueryClient();
  const [tab, setTab] = useState<Tab>("products");
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<ImagePreview[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isAdmin = user?.role === "admin";

  useSeo({
    title: "Admin",
    description: "Gestion de productos y pedidos de Magus By Lili.",
    canonical: `${import.meta.env.VITE_SITE_URL || window.location.origin}/admin`
  });

  const productsQuery = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => api.products.list({ limit: 200, page: 1 }),
    enabled: !!user,
  });

  const categoriesQuery = useQuery({
    queryKey: ["admin-categories"],
    queryFn: () => api.categories.list(),
    enabled: !!user,
  });

  const ordersQuery = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => api.orders.listAll(),
    enabled: isAdmin,
  });

  const promoteMutation = useMutation({
    mutationFn: () => api.auth.promoteAdmin({}),
    onSuccess: (data) => {
      toast.success("Cuenta promovida a admin");
      setUser(data as any);
    },
    onError: (err: any) => {
      toast.error(err.message || "No se pudo promover");
    },
  });

  const createMutation = useMutation({
    mutationFn: (payload: Partial<Product>) => api.admin.products.create(payload),
    onSuccess: () => {
      toast.success("Producto creado");
      setForm(emptyForm);
      qc.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "No se pudo crear");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Product> }) =>
      api.admin.products.update(id, payload),
    onSuccess: () => {
      toast.success("Producto actualizado");
      setEditing(null);
      setForm(emptyForm);
      qc.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "No se pudo actualizar");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.admin.products.remove(id),
    onSuccess: () => {
      toast.success("Producto eliminado");
      qc.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "No se pudo eliminar");
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => api.orders.updateStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "No se pudo actualizar estado");
    },
  });

  const products = useMemo(() => productsQuery.data?.data ?? [], [productsQuery.data]);
  const orders = useMemo(() => ordersQuery.data ?? [], [ordersQuery.data]);
  const categories = useMemo(() => categoriesQuery.data ?? [], [categoriesQuery.data]);

  function startEdit(product: Product) {
    setEditing(product);
    const existing = (product.thumbnails || []).map((url, index) => ({
      url,
      name: `Imagen ${index + 1}`,
      path: product.thumbnailPaths?.[index],
      source: "existing" as const,
    }));
    setImages(existing);
    setForm({
      title: product.title || "",
      description: product.description || "",
      price: product.price?.toString() || "",
      stock: product.stock?.toString() || "",
      category: product.category || "",
      thumbnails: (product.thumbnails || []).join(", "),
    });
  }

  function resetForm() {
    setEditing(null);
    setImages([]);
    setForm(emptyForm);
  }

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    if (!editing?._id) {
      toast.error("Guarda el producto primero para subir imagenes");
      return;
    }
    setUploading(true);
    try {
      const uploads = await Promise.all(
        Array.from(files).map(async (file) => {
          const safeName = file.name.replace(/\s+/g, "-").toLowerCase();
          const path = `products/${editing._id}/${Date.now()}-${safeName}`;
          const storageRef = ref(storage, path);
          await uploadBytes(storageRef, file);
          const url = await getDownloadURL(storageRef);
          return { name: file.name, url, path };
        })
      );
      setImages((prev) => [
        ...prev,
        ...uploads.map((file) => ({ url: file.url, name: file.name, path: file.path, source: "upload" as const })),
      ]);
      setForm((prev) => ({
        ...prev,
        thumbnails: [...prev.thumbnails.split(",").map((t) => t.trim()).filter(Boolean), ...uploads.map((u) => u.url)].join(", "),
      }));

      toast.success("Imagenes cargadas");
    } catch (err: any) {
      toast.error(err.message || "No se pudo subir");
    } finally {
      setUploading(false);
    }
  }

  async function removeImage(url: string, path?: string) {
    if (path) {
      try {
        await deleteObject(ref(storage, path));
      } catch (err) {
        console.warn("No se pudo borrar del storage", err);
      }
    }
    setImages((prev) => prev.filter((img) => img.url !== url));
    setForm((prev) => ({
      ...prev,
      thumbnails: prev.thumbnails
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t && t !== url)
        .join(", "),
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const thumbnailUrls = form.thumbnails
      ? form.thumbnails.split(",").map((t) => t.trim()).filter(Boolean)
      : [];
    const payload: Partial<Product> = {
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      price: form.price ? Number(form.price) : undefined,
      stock: form.stock ? Number(form.stock) : undefined,
      category: form.category.trim() || undefined,
      thumbnails: thumbnailUrls.length ? thumbnailUrls : undefined,
      thumbnailPaths: images
        .filter((img) => thumbnailUrls.includes(img.url))
        .map((img) => img.path)
        .filter((path): path is string => Boolean(path))
    };

    if (!payload.title || payload.price === undefined) {
      toast.error("Titulo y precio son obligatorios");
      return;
    }

    if (editing) {
      updateMutation.mutate({ id: editing._id, payload });
    } else {
      createMutation.mutate(payload);
    }
  }

  if (!user) {
    return (
      <section className="max-w-xl mx-auto space-y-4">
        <h1 className="text-3xl font-semibold">Dashboard admin</h1>
        <p className="subtle">Necesitas iniciar sesion para continuar.</p>
        <Link to="/auth" className="btn btn-primary w-fit">Ir a login</Link>
      </section>
    );
  }

  if (!isAdmin) {
    return (
      <section className="max-w-xl mx-auto space-y-4">
        <h1 className="text-3xl font-semibold">Dashboard admin</h1>
        <p className="subtle">Tu cuenta no tiene permisos de administrador.</p>
        <button
          className="btn btn-primary"
          onClick={() => promoteMutation.mutate()}
          disabled={promoteMutation.isPending}
        >
          {promoteMutation.isPending ? "Promoviendo..." : "Promover mi cuenta"}
        </button>
        <p className="text-sm subtle">Solo funciona si no existe ningun admin.</p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-[hsl(var(--muted))]">Administracion</p>
          <h1 className="text-3xl font-semibold">Dashboard admin</h1>
        </div>
        <div className="flex gap-2">
          <button
            className={`btn ${tab === "products" ? "btn-primary" : ""}`}
            onClick={() => setTab("products")}
          >
            Productos
          </button>
          <button
            className={`btn ${tab === "orders" ? "btn-primary" : ""}`}
            onClick={() => setTab("orders")}
          >
            Pedidos
          </button>
        </div>
      </header>

      {tab === "products" && (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="card space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Catalogo</h2>
                <p className="text-sm subtle">{products.length} productos</p>
              </div>
              <button className="btn" onClick={() => productsQuery.refetch()}>Recargar</button>
            </div>

            <div className="space-y-3">
              {productsQuery.isLoading && <p>Cargando productos...</p>}
              {!productsQuery.isLoading && products.length === 0 && (
                <p className="subtle">No hay productos registrados.</p>
              )}
              {products.map((product) => (
                <div key={product._id} className="border rounded-2xl p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">{product.title}</p>
                      <p className="text-sm subtle">{product.category || "Sin categoria"} · Stock {product.stock ?? 0}</p>
                      <p className="text-sm">$ {product.price?.toLocaleString("es-CO")}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="btn" onClick={() => startEdit(product)}>Editar</button>
                      <button
                        className="btn"
                        onClick={() => {
                          if (confirm("Eliminar producto?")) deleteMutation.mutate(product._id);
                        }}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold mb-2">{editing ? "Editar producto" : "Nuevo producto"}</h2>
            <form className="space-y-3" onSubmit={handleSubmit}>
              <input
                className="w-full border rounded-xl px-3 py-2"
                placeholder="Titulo"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
              <textarea
                className="w-full border rounded-xl px-3 py-2 min-h-[90px]"
                placeholder="Descripcion"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  className="w-full border rounded-xl px-3 py-2"
                  placeholder="Precio"
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                />
                <input
                  className="w-full border rounded-xl px-3 py-2"
                  placeholder="Stock"
                  type="number"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Categoria</label>
                <select
                  className="w-full border rounded-xl px-3 py-2"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  <option value="">Sin categoria</option>
                  {categories.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Imagenes</label>
                <input
                  ref={fileInputRef}
                  className="hidden"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleUpload(e.target.files)}
                  disabled={!editing?._id}
                />
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={!editing?._id || uploading}
                  >
                    {uploading ? "Subiendo..." : "Subir imagenes"}
                  </button>
                  {!editing?._id && (
                    <p className="text-sm subtle">Guarda el producto primero.</p>
                  )}
                </div>
                {uploading && <p className="text-sm subtle">Subiendo imagenes...</p>}
                {images.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {images.map((item) => (
                      <div key={item.url} className="border rounded-xl p-2 text-xs space-y-2">
                        <div className="aspect-square overflow-hidden rounded-lg bg-[hsl(var(--brand-50))]">
                          <img
                            src={item.url}
                            alt={item.name}
                            className="h-full w-full object-cover"
                            loading="lazy"
                            decoding="async"
                            width={160}
                            height={160}
                          />
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate max-w-[110px]">{item.name}</p>
                          <button
                            type="button"
                            className="text-[11px] underline"
                            onClick={() => removeImage(item.url, item.path)}
                          >
                            Quitar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <input
                  className="w-full border rounded-xl px-3 py-2"
                  placeholder="Imagenes (URL separadas por coma)"
                  value={form.thumbnails}
                  onChange={(e) => setForm({ ...form, thumbnails: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {editing ? "Guardar cambios" : "Crear producto"}
                </button>
                {editing && (
                  <button type="button" className="btn" onClick={resetForm}>Cancelar</button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {tab === "orders" && (
        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Pedidos</h2>
              <p className="text-sm subtle">{orders.length} pedidos</p>
            </div>
            <button className="btn" onClick={() => ordersQuery.refetch()}>Recargar</button>
          </div>

          {ordersQuery.isLoading && <p>Cargando pedidos...</p>}
          {!ordersQuery.isLoading && orders.length === 0 && (
            <p className="subtle">No hay pedidos aun.</p>
          )}
          <div className="space-y-3">
            {orders.map((order: Order) => (
              <div key={order._id} className="border rounded-2xl p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">Orden #{order._id}</p>
                    <p className="text-sm subtle">{order.items.length} items · $ {order.amount?.toLocaleString("es-CO")}</p>
                    {order.createdAt && (
                      <p className="text-xs subtle">{new Date(order.createdAt).toLocaleString("es-CO")}</p>
                    )}
                    <div className="text-sm">
                      {order.items.slice(0, 2).map((item) => (
                        <p key={item.title}>{item.title} x {item.qty}</p>
                      ))}
                      {order.items.length > 2 && (
                        <p className="subtle">+ {order.items.length - 2} mas</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-[hsl(var(--muted))]">Estado</label>
                    <select
                      className="w-full border rounded-xl px-3 py-2"
                      value={order.status}
                      onChange={(e) => statusMutation.mutate({ id: order._id, status: e.target.value })}
                      disabled={statusMutation.isPending}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
