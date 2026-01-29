import { useEffect, useState } from "react";
import { useCart } from "../store/cart";
import { useAuth } from "../store/auth";
import { api } from "../lib/api";
import { createWompiPayment, redirectToWompiCheckout, generatePaymentReference, formatAmountForWompi, PAYMENT_METHODS } from "../lib/wompi";
import { toast } from "sonner";
import { ShoppingBag, MapPin, User, Phone, Mail, Truck, ShieldCheck, ArrowLeft, CreditCard, LogIn, UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import PaymentMethodSelector from "../components/PaymentMethodSelector";
import CardForm, { CardData } from "../components/CardForm";
import PSEForm, { PSEFormData } from "../components/PSEForm";
import { useSeo } from "../lib/seo";

export default function Checkout() {
    const { items, clear, total } = useCart();
    const user = useAuth(s => s.user);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useSeo({
        title: "Checkout",
        description: "Finaliza tu compra de joyeria artesanal con pagos seguros en Colombia.",
        canonical: `${import.meta.env.VITE_SITE_URL || window.location.origin}/checkout`
    });
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [isGuest, setIsGuest] = useState(!user);
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [mockMode, setMockMode] = useState(false);
    const [mockStatus, setMockStatus] = useState<'APPROVED' | 'DECLINED' | 'ERROR' | 'PENDING'>('APPROVED');

    const [formData, setFormData] = useState({
        fullName: "",
        email: user?.email || "",
        phone: "",
        address: "",
        city: "",
        department: "",
        notes: ""
    });

    const isAdmin = user?.role === 'admin';

    // Actualizar email cuando el estado de usuario cambia
    useEffect(() => {
        if (user) {
            setFormData(prev => ({ ...prev, email: user.email }));
            setIsGuest(false);
        }
    }, [user]);

    const [errors, setErrors] = useState<Record<string, string>>({});

    const subtotal = total();
    const ENVIO_GRATIS_MINIMO = 120000;
    const COSTO_ENVIO = 8000;
    const envio = subtotal >= ENVIO_GRATIS_MINIMO ? 0 : COSTO_ENVIO;
    const totalFinal = subtotal + envio;

    function validate() {
        const newErrors: Record<string, string> = {};
        const email = formData.email.trim().toLowerCase();
        if (!formData.fullName.trim()) newErrors.fullName = "El nombre es requerido";
        if (!email) newErrors.email = "El email es requerido";
        else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Email inválido";
        if (!formData.phone.trim()) newErrors.phone = "El teléfono es requerido";
        if (!formData.address.trim()) newErrors.address = "La dirección es requerida";
        if (!formData.city.trim()) newErrors.city = "La ciudad es requerida";
        if (!formData.department.trim()) newErrors.department = "El departamento es requerido";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }


    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    }

    const handleLogin = () => {
        navigate('/auth?redirect=/checkout');
    };

    const handleCreateAccount = () => {
        navigate('/auth?mode=register&redirect=/checkout');
    };

    async function handlePayment(paymentData: CardData | PSEFormData) {
        try {
            if (!validate()) {
                toast.error("Por favor completa todos los campos");
                return;
            }

            setLoading(true);

            // Crear referencia única
            const paymentReference = generatePaymentReference();

            // Preparar datos para Wompi
            const wompiData = {
                amount_in_cents: formatAmountForWompi(totalFinal),
                currency: 'COP',
                customer_email: formData.email,
                payment_method: paymentMethod === 'card' ? PAYMENT_METHODS.CARD : PAYMENT_METHODS.PSE,
                reference: paymentReference,
                redirect_url: `${window.location.origin}/payment-confirmation?ref=${paymentReference}`,
                // Para pagos con tarjeta
                ...(paymentMethod === 'card' && {
                    payment_source_id: null // Aquí iría el tokenizado de la tarjeta
                }),
                // Datos adicionales para PSE
                ...(paymentMethod === 'pse' && {
                    customer_data: {
                        legal_id_type: (paymentData as PSEFormData).documentType,
                        legal_id: (paymentData as PSEFormData).documentNumber,
                        full_name: (paymentData as PSEFormData).name
                    }
                })
            };

            // Crear el pago en Wompi
            const wompiResponse = await createWompiPayment({
                ...wompiData,
                mockStatus: mockMode ? mockStatus : undefined
            });

            // Guardar la orden en tu base de datos primero
            const orderBody = {
                items: items.map(i => ({ 
                    productId: i.product._id, 
                    title: i.product.title, 
                    price: i.product.price, 
                    qty: i.qty 
                })),
                customerInfo: {
                    fullName: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    address: {
                        fullName: formData.fullName,
                        phone: formData.phone,
                        line1: formData.address,
                        city: formData.city,
                        department: formData.department,
                        country: "CO",
                        notes: formData.notes
                    }
                },
                subtotal,
                shipping: envio,
                total: totalFinal,
                paymentRef: paymentReference,
                paymentMethod,
                isGuest,
                userId: user?._id || null,
                transactionId: wompiResponse.data.id,
                status: mockMode ? mockStatus.toLowerCase() : undefined
            };

            await api.orders.create(orderBody);

            // Redirigir al checkout de Wompi
            if (mockMode) {
                const statusParam = wompiResponse.data.status || mockStatus;
                window.location.href = `/payment-confirmation?ref=${paymentReference}&status=${statusParam}`;
                return;
            } else if (paymentMethod === 'card') {
                redirectToWompiCheckout(wompiResponse.data.id);
            } else {
                // Para PSE, redirigir directamente al resultado
                window.location.href = wompiResponse.data.payment_method.extra.url;
            }

        } catch (err: any) {
            toast.error(err.message || "Error al procesar el pago");
            setLoading(false);
        }
    }

    if (!items.length) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <ShoppingBag className="w-24 h-24 text-gray-300 mb-4" />
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Tu carrito está vacío</h2>
                <p className="text-gray-500 mb-6">Agrega algunos productos para continuar</p>
                <Link to="/" className="bg-[#C9A86C] text-white px-6 py-3 rounded-xl hover:bg-[#b89559] transition-colors">
                    Ver productos
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="mb-8">
                <Link to="/" className="inline-flex items-center text-gray-600 hover:text-[#C9A86C] mb-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver a la tienda
                </Link>
                <h1 className="text-3xl font-semibold text-gray-800">Finalizar compra</h1>
            </div>

            <div className="grid lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3">
                    {!user && (
                        <div className="bg-gradient-to-r from-[#C9A86C]/10 to-[#b89559]/10 border border-[#C9A86C]/20 rounded-2xl p-6 mb-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-[#C9A86C]/20 rounded-full flex items-center justify-center">
                                        <UserPlus className="w-6 h-6 text-[#C9A86C]" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">¿Ya tienes una cuenta?</h3>
                                        <p className="text-gray-600 text-sm">Inicia sesión para un proceso más rápido</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleLogin}
                                        className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                                    >
                                        <LogIn className="w-4 h-4" />
                                        Iniciar sesión
                                    </button>
                                    <button
                                        onClick={() => setIsGuest(false)}
                                        className={`px-4 py-2 rounded-xl transition-colors ${
                                            !isGuest 
                                                ? 'bg-[#C9A86C] text-white' 
                                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        Comprar como invitado
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {user && (
                        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                    <User className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-green-800 font-medium">Sesión iniciada como {user.email}</p>
                                    <p className="text-green-600 text-sm">Tus datos están pre-cargados</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {isGuest && (
                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                                    <UserPlus className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-amber-800 font-medium">Compras como invitado</p>
                                    <p className="text-amber-600 text-sm">Puedes crear una cuenta después si lo prefieres</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Contact Information Form */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <User className="w-5 h-5 mr-2 text-[#C9A86C]" />
                            Información de contacto y envío
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre completo *</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className={`w-full border rounded-xl px-4 py-3 outline-none transition-all ${errors.fullName ? 'border-red-500' : 'border-gray-200'}`}
                                    placeholder="Ej: María García"
                                />
                                {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`w-full border rounded-xl px-4 py-3 outline-none ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
                                        placeholder="tu@email.com"
                                    />
                                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className={`w-full border rounded-xl px-4 py-3 outline-none ${errors.phone ? 'border-red-500' : 'border-gray-200'}`}
                                        placeholder="300 123 4567"
                                    />
                                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Dirección completa *</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className={`w-full border rounded-xl px-4 py-3 outline-none ${errors.address ? 'border-red-500' : 'border-gray-200'}`}
                                    placeholder="Calle 123 #45-67, Apto 201"
                                />
                                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Ciudad *</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className={`w-full border rounded-xl px-4 py-3 outline-none ${errors.city ? 'border-red-500' : 'border-gray-200'}`}
                                        placeholder="Bogotá"
                                    />
                                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Departamento *</label>
                                    <select
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        className={`w-full border rounded-xl px-4 py-3 outline-none ${errors.department ? 'border-red-500' : 'border-gray-200'}`}
                                    >
                                        <option value="">Seleccionar...</option>
                                        <option value="Amazonas">Amazonas</option>
                                        <option value="Antioquia">Antioquia</option>
                                        <option value="Atlántico">Atlántico</option>
                                        <option value="Bogotá D.C.">Bogotá D.C.</option>
                                        <option value="Bolívar">Bolívar</option>
                                        <option value="Boyacá">Boyacá</option>
                                        <option value="Caldas">Caldas</option>
                                        <option value="Caquetá">Caquetá</option>
                                        <option value="Casanare">Casanare</option>
                                        <option value="Cauca">Cauca</option>
                                        <option value="Cesar">Cesar</option>
                                        <option value="Chocó">Chocó</option>
                                        <option value="Córdoba">Córdoba</option>
                                        <option value="Cundinamarca">Cundinamarca</option>
                                        <option value="Guainía">Guainía</option>
                                        <option value="Guaviare">Guaviare</option>
                                        <option value="Huila">Huila</option>
                                        <option value="La Guajira">La Guajira</option>
                                        <option value="Magdalena">Magdalena</option>
                                        <option value="Meta">Meta</option>
                                        <option value="Nariño">Nariño</option>
                                        <option value="Norte de Santander">Norte de Santander</option>
                                        <option value="Putumayo">Putumayo</option>
                                        <option value="Quindío">Quindío</option>
                                        <option value="Risaralda">Risaralda</option>
                                        <option value="San Andrés">San Andrés</option>
                                        <option value="Santander">Santander</option>
                                        <option value="Sucre">Sucre</option>
                                        <option value="Tolima">Tolima</option>
                                        <option value="Valle del Cauca">Valle del Cauca</option>
                                        <option value="Vaupés">Vaupés</option>
                                        <option value="Vichada">Vichada</option>
                                    </select>
                                    {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Notas (opcional)</label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none resize-none"
                                    placeholder="Instrucciones para la entrega..."
                                />
                            </div>
                        </div>
                    </div>

                    {isAdmin && (
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-sm font-semibold text-gray-800 mb-3">Modo prueba (admin)</h3>
                            <div className="flex flex-wrap items-center gap-3">
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={mockMode}
                                        onChange={(e) => setMockMode(e.target.checked)}
                                    />
                                    Simular pago
                                </label>
                                {mockMode && (
                                    <select
                                        value={mockStatus}
                                        onChange={(e) => setMockStatus(e.target.value as any)}
                                        className="border rounded-lg px-3 py-2 text-sm"
                                    >
                                        <option value="APPROVED">Aprobado</option>
                                        <option value="DECLINED">Rechazado</option>
                                        <option value="PENDING">Pendiente</option>
                                        <option value="ERROR">Error</option>
                                    </select>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Payment Method Selection */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <PaymentMethodSelector 
                            selectedMethod={paymentMethod}
                            onMethodChange={setPaymentMethod}
                        />
                    </div>

                    {/* Payment Form */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        {paymentMethod === 'card' ? (
                            <CardForm 
                                onSubmit={(cardData) => handlePayment(cardData)}
                                loading={loading}
                            />
                        ) : paymentMethod === 'pse' ? (
                            <PSEForm 
                                onSubmit={(pseData) => handlePayment(pseData)}
                                loading={loading}
                            />
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500">
                                    Método de pago {paymentMethod} próximamente disponible
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <ShoppingBag className="w-5 h-5 mr-2 text-[#C9A86C]" />
                            Resumen de tu orden
                        </h2>

                        <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                            {items.map((item) => (
                                <div key={item.product._id} className="flex gap-3">
                                    <div className="relative">
                                        <img
                                            src={item.product.thumbnails?.[0] || item.product.image || '/hero-placeholder.png'}
                                            alt={item.product.title}
                                            className="w-16 h-16 object-cover rounded-lg"
                                            loading="lazy"
                                            decoding="async"
                                            width={64}
                                            height={64}
                                        />
                                        <span className="absolute -top-2 -right-2 bg-[#C9A86C] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                            {item.qty}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-800 truncate">{item.product.title}</p>
                                        <p className="text-sm text-gray-500">${item.product.price.toLocaleString("es-CO")} c/u</p>
                                    </div>
                                    <p className="font-semibold">${(item.product.price * item.qty).toLocaleString("es-CO")}</p>
                                </div>
                            ))}
                        </div>

                        <div className="border-t pt-4 space-y-3">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>${subtotal.toLocaleString("es-CO")}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Envío</span>
                                {envio === 0 ? (
                                    <span className="text-green-600 font-medium">¡Gratis!</span>
                                ) : (
                                    <span>${envio.toLocaleString("es-CO")}</span>
                                )}
                            </div>
                            
                            {subtotal < ENVIO_GRATIS_MINIMO && (
                                <div className="bg-amber-50 rounded-lg p-3">
                                    <p className="text-sm text-amber-800 mb-2">
                                        🚚 Te faltan <strong>${(ENVIO_GRATIS_MINIMO - subtotal).toLocaleString("es-CO")}</strong> para envío gratis
                                    </p>
                                    <div className="w-full bg-amber-200 rounded-full h-2">
                                        <div 
                                            className="bg-[#C9A86C] h-2 rounded-full"
                                            style={{ width: `${Math.min((subtotal / ENVIO_GRATIS_MINIMO) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="border-t mt-4 pt-4 flex justify-between items-center">
                            <span className="text-lg font-semibold text-gray-800">Total</span>
                            <span className="text-2xl font-bold text-[#C9A86C]">${totalFinal.toLocaleString("es-CO")}</span>
                        </div>

                        <div className="mt-6 space-y-2 text-sm text-gray-500">
                            <div className="flex items-center">
                                <ShieldCheck className="w-4 h-4 mr-2 text-green-500" />
                                Compra 100% segura
                            </div>
                            <div className="flex items-center">
                                <Truck className="w-4 h-4 mr-2 text-green-500" />
                                Envío a toda Colombia
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}