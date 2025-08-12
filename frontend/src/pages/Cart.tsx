import { useCart } from "../store/cart";
import { Link } from "react-router-dom";

export default function Cart() {
    const { items, setQty, remove, total, clear } = useCart();
    const t = total();
    if (!items.length) return <p>Tu carrito está vacío. <Link className="underline" to="/">Ir a la tienda</Link></p>;
    return (
        <section className="space-y-4">
            <h1 className="text-2xl font-semibold">Carrito</h1>
            <ul className="divide-y border rounded-2xl">
                {items.map(({ product, qty }) => (
                    <li key={product._id} className="p-3 flex items-center gap-3">
                        <img src={product.thumbnails?.[0]} className="w-16 h-16 object-cover rounded-lg bg-neutral-100 dark:bg-neutral-900" />
                        <div className="flex-1">
                            <p className="font-medium">{product.title}</p>
                            <p className="opacity-80 text-sm">$ {product.price.toLocaleString("es-CO")}</p>
                        </div>
                        <input type="number" min={1} value={qty}
                            onChange={e => setQty(product._id, Math.max(1, Number(e.target.value) || 1))}
                            className="w-16 border rounded-lg px-2 py-1" />
                        <button onClick={() => remove(product._id)} className="ml-2 text-sm underline">Quitar</button>
                    </li>
                ))}
            </ul>
            <div className="flex items-center justify-between">
                <button onClick={clear} className="text-sm underline">Vaciar</button>
                <div className="text-right">
                    <p>Total: <strong>$ {t.toLocaleString("es-CO")}</strong></p>
                    <Link to="/checkout" className="inline-block mt-2 rounded-xl border px-4 py-2">Ir a pagar</Link>
                </div>
            </div>
        </section>
    );
}
