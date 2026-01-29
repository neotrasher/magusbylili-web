import { useCart } from "../store/cart";
import { Link } from "react-router-dom";
import { ShoppingBag, Trash2 } from "lucide-react";
import { useSeo } from "../lib/seo";

export default function Cart() {
    const { items, setQty, remove, total, clear } = useCart();
    const t = total();

    useSeo({
        title: "Carrito",
        description: "Revisa tu carrito y finaliza tu compra en Magus By Lili.",
        canonical: `${import.meta.env.VITE_SITE_URL || window.location.origin}/cart`
    });

    if (!items.length) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <ShoppingBag className="w-24 h-24 text-gray-300 mb-4" />
                <h2 className="text-2xl font-light text-gray-700 mb-2">Tu carrito está vacío</h2>
                <p className="text-gray-500 mb-6 max-w-sm mx-auto">Parece que aún no has agregado productos</p>
                <Link 
                    to="/" 
                    className="bg-[#C9A86C] text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
                >
                    Ver productos →
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="mb-8">
                <Link to="/" className="inline-flex items-center text-gray-600 hover:text-[#C9A86C] mb-4">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7 7" />
                    </svg>
                    Volver a la tienda
                </Link>
                <h1 className="text-3xl font-light text-gray-800">
                    Tu carrito ({items.length} productos)
                </h1>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div key={item.product._id} className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-[#C9A86C]/20 transition-all duration-200">
                                    <div className="flex-shrink-0">
                                        <img 
                                            src={item.product.thumbnails?.[0] || item.product.image || '/hero-placeholder.png'} 
                                            alt={item.title}
                                            className="w-24 h-24 rounded-lg object-cover bg-gray-100" 
                                            loading="lazy"
                                            decoding="async"
                                            width={96}
                                            height={96}
                                        />
                                        <span className="absolute -top-2 -right-2 bg-[#C9A86C] text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-medium">
                                            {item.qty}
                                        </span>
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <span>Cada uno:</span>
                                            <span>${item.price.toLocaleString("es-CO")}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => setQty(item.product._id, Math.max(1, item.qty - 1))}
                                            className="p-1 hover:bg-gray-200 rounded transition-colors disabled:opacity-50"
                                            disabled={item.qty <= 1}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7-7" />
                                            </svg>
                                        </button>
                                        <span className="w-8 text-center">{item.qty}</span>
                                        <button 
                                            onClick={() => setQty(item.product._id, item.qty + 1)}
                                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 13l-7 7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                    
                                    <div className="text-right">
                                        <div className="text-xs text-gray-500">Subtotal</div>
                                        <div className="font-semibold text-gray-800">
                                            ${(item.price * item.qty).toLocaleString("es-CO")}
                                        </div>
                                        <button 
                                            onClick={() => remove(item.product._id)}
                                            className="w-full p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors text-xs mt-2"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">Resumen del pedido</h2>
                            </div>
                            
                            <div className="space-y-3 mb-6">
                                {items.map((item) => (
                                    <div key={item.product._id} className="flex gap-3 items-center p-3 bg-gray-50 rounded-lg">
                                        <img 
                                            src={item.product.thumbnails?.[0] || item.product.image || '/hero-placeholder.png'} 
                                            alt={item.title}
                                            className="w-12 h-12 rounded-lg object-cover bg-gray-100" 
                                            loading="lazy"
                                            decoding="async"
                                            width={48}
                                            height={48}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-800 text-sm">{item.title}</p>
                                            <p className="text-xs text-gray-500">x{item.qty}</p>
                                        </div>
                                        <p className="font-semibold text-gray-800">
                                            ${(item.price * item.qty).toLocaleString("es-CO")}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="border-t pt-4 space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Subtotal</span>
                                    <span className="font-medium text-gray-800">${t.toLocaleString("es-CO")}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Envío</span>
                                    <span className="font-medium text-green-600">¡Gratis!</span>
                                </div>
                                <div className="border-t pt-3">
                                    <div className="flex justify-between">
                                        <span className="text-lg font-semibold text-gray-800">Total</span>
                                        <span className="text-xl font-bold text-[#C9A86C]">${t.toLocaleString("es-CO")}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <button 
                                    onClick={clear} 
                                    className="w-full border border-gray-200 text-gray-700 hover:bg-gray-50 py-3 rounded-xl font-medium transition-colors"
                                >
                                    Vaciar carrito
                                </button>
                                <Link 
                                    to="/checkout" 
                                    className="block w-full bg-[#C9A86C] hover:bg-[#b89559] text-white py-3 rounded-xl font-semibold transition-all duration-200 text-center"
                                >
                                    Procesar pedido
                                    <svg className="w-5 h-5 inline-block ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7" />
                                    </svg>
                                </Link>
                            </div>
                            
                            <div className="flex items-center justify-center gap-6 pt-4 border-t border-gray-200">
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <span>Pago seguro</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <span>Envío rápido</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}