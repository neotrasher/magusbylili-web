import { useState } from "react";
import { useCart } from "../store/cart";
import { useAuth } from "../store/auth";
import { api } from "../lib/api";
import { toast } from "sonner";

export default function Checkout() {
    const { items, clear, total } = useCart();
    const user = useAuth(s => s.user);
    const [address, setAddress] = useState({ line1: "", city: "", country: "CO" });
    const [loading, setLoading] = useState(false);

    if (!items.length) return <p>Tu carrito está vacío.</p>;

    async function submit(e: React.FormEvent) {
        e.preventDefault(); setLoading(true);
        try {
            if (!user) throw new Error("Inicia sesión antes de pagar");
            const body = {
                items: items.map(i => ({ productId: i.product._id, title: i.product.title, price: i.product.price, qty: i.qty })),
                address, paymentRef: "demo"
            };
            const order = await api.orders.create(body);
            toast.success("Orden creada #" + order._id);
            clear();
        } catch (err: any) {
            toast.error(err.message || "Error en checkout");
        } finally { setLoading(false); }
    }

    return (
        <form onSubmit={submit} className="max-w-lg space-y-3">
            <h1 className="text-2xl font-semibold">Checkout</h1>
            <input className="w-full border rounded-xl px-3 py-2" placeholder="Dirección"
                value={address.line1} onChange={e => setAddress({ ...address, line1: e.target.value })} required />
            <div className="grid grid-cols-2 gap-3">
                <input className="border rounded-xl px-3 py-2" placeholder="Ciudad"
                    value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} required />
                <input className="border rounded-xl px-3 py-2" placeholder="País"
                    value={address.country} onChange={e => setAddress({ ...address, country: e.target.value })} required />
            </div>
            <p>Total: <strong>$ {total().toLocaleString("es-CO")}</strong></p>
            <button disabled={loading} className="rounded-xl border px-4 py-2">{loading ? "Procesando…" : "Confirmar orden"}</button>
        </form>
    );
}
