import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export default function Account() {
    const me = useQuery({ queryKey: ["me"], queryFn: api.auth.me });
    const orders = useQuery({ queryKey: ["orders"], queryFn: api.orders.list, enabled: !!me.data });

    if (me.isLoading) return <p>Cargando…</p>;
    if (!me.data) return <p>No has iniciado sesión.</p>;

    return (
        <section className="space-y-4">
            <h1 className="text-2xl font-semibold">Hola, {me.data.name}</h1>
            <h2 className="text-lg font-medium">Tus órdenes</h2>
            <ul className="space-y-2">
                {orders.data?.map((o: any) => (
                    <li key={o._id} className="border rounded-xl p-3">
                        <p>Orden #{o._id}</p>
                        <p>Items: {o.items.length} — Total: $ {o.amount.toLocaleString("es-CO")}</p>
                        <p className="text-sm opacity-75">{new Date(o.createdAt).toLocaleString()}</p>
                    </li>
                ))}
            </ul>
        </section>
    );
}
