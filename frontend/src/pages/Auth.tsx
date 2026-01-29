import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../store/auth";
import { toast } from "sonner";
import { useSeo } from "../lib/seo";


export default function Auth() {
    const setUser = useAuth(s => s.setUser);
    const navigate = useNavigate();
    const [mode, setMode] = useState<"login" | "register">("login");
    const [loading, setLoading] = useState(false);
    const [resetOpen, setResetOpen] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [e.target.name]: e.target.value });

    useSeo({
        title: mode === "login" ? "Iniciar sesion" : "Crear cuenta",
        description: "Accede a tu cuenta o crea una nueva para gestionar tus pedidos.",
        canonical: `${import.meta.env.VITE_SITE_URL || window.location.origin}/auth`
    });


    async function submit(e: React.FormEvent) {
        e.preventDefault(); setLoading(true);
        try {
            const user = mode === "login"
                ? await api.auth.login({ email: form.email, password: form.password })
                : await api.auth.register({ name: form.name, email: form.email, password: form.password });
            setUser(user as any);
            toast.success("¡Bienvenido!");
            navigate("/account");

        } catch (err: any) {
            toast.error(err.message || "Error");
        } finally { setLoading(false); }
    }

    return (
        <div className="max-w-md mx-auto">
            <div className="flex gap-4 mb-4">
                <button className={`px-3 py-2 rounded-xl border ${mode === 'login' ? 'bg-black text-white dark:bg-white dark:text-black' : ''}`} onClick={() => setMode("login")}>Iniciar sesión</button>
                <button className={`px-3 py-2 rounded-xl border ${mode === 'register' ? 'bg-black text-white dark:bg-white dark:text-black' : ''}`} onClick={() => setMode("register")}>Crear cuenta</button>
            </div>
            <form onSubmit={submit} className="space-y-3">
                {mode === "register" && (
                    <input className="w-full border rounded-xl px-3 py-2" name="name" placeholder="Nombre" value={form.name} onChange={onChange} required />
                )}
                <input className="w-full border rounded-xl px-3 py-2" type="email" name="email" placeholder="Email" value={form.email} onChange={onChange} required />
                <input className="w-full border rounded-xl px-3 py-2" type="password" name="password" placeholder="Contraseña" value={form.password} onChange={onChange} required />
                <button disabled={loading} className="w-full rounded-xl py-2 border">{loading ? "Procesando…" : (mode === "login" ? "Entrar" : "Registrarme")}</button>
            </form>
            {mode === "login" && (
                <div className="mt-3">
                    <button className="text-sm underline" onClick={() => setResetOpen((v) => !v)}>
                        {resetOpen ? "Cancelar" : "Olvidaste tu contraseña?"}
                    </button>
                    {resetOpen && (
                        <form
                            className="mt-3 space-y-2"
                            onSubmit={async (e) => {
                                e.preventDefault();
                                if (!resetEmail) {
                                    toast.error("Ingresa tu email");
                                    return;
                                }
                                try {
                                    await api.auth.requestPasswordReset({ email: resetEmail });
                                    toast.success("Si el correo existe, enviamos un enlace");
                                    setResetEmail("");
                                    setResetOpen(false);
                                } catch (err: any) {
                                    toast.error(err.message || "No se pudo enviar");
                                }
                            }}
                        >
                            <input
                                className="w-full border rounded-xl px-3 py-2"
                                type="email"
                                placeholder="Tu email"
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                            />
                            <button className="btn btn-secondary" type="submit">
                                Enviar enlace
                            </button>
                        </form>
                    )}
                </div>
            )}

        </div>
    );
}
