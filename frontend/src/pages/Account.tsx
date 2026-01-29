import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "../lib/api";
import { useAuth } from "../store/auth";
import { useSeo } from "../lib/seo";

export default function Account() {
    const user = useAuth((s) => s.user);
    const setUser = useAuth((s) => s.setUser);
    const qc = useQueryClient();
    const me = useQuery({ queryKey: ["me"], queryFn: api.auth.me });

    useSeo({
        title: "Mi cuenta",
        description: "Gestiona tus datos, pedidos y seguridad en Magus By Lili.",
        canonical: `${import.meta.env.VITE_SITE_URL || window.location.origin}/account`
    });
    const orders = useQuery({ queryKey: ["orders"], queryFn: api.orders.list, enabled: !!me.data });
    const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
    const [emailForm, setEmailForm] = useState({ newEmail: "" });
    const [saving, setSaving] = useState(false);
    const [savingEmail, setSavingEmail] = useState(false);

    if (me.isLoading) return <p>Cargando…</p>;
    if (!me.data) return <p>No has iniciado sesión.</p>;

    return (
        <section className="space-y-6">
            <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-[hsl(var(--muted))]">Cuenta</p>
                    <h1 className="text-2xl font-semibold">Hola, {me.data.name}</h1>
                    <p className="text-sm subtle">{me.data.email}</p>
                    {user?.role === "admin" && (
                        <p className="text-xs subtle">Rol: {me.data.role || "customer"}</p>
                    )}
                </div>
                {user && (
                    <button
                        className="btn"
                        onClick={async () => {
                            await api.auth.logout();
                            setUser(null);
                            qc.clear();
                        }}
                    >
                        Cerrar sesión
                    </button>
                )}
            </header>

            <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
                <div className="card space-y-6">
                    <div>
                        <h2 className="text-lg font-semibold">Cambiar correo</h2>
                        <p className="text-sm subtle">Enviaremos un enlace de confirmacion al nuevo correo.</p>
                        <form
                            className="mt-3 space-y-3"
                            onSubmit={async (e) => {
                                e.preventDefault();
                                if (!emailForm.newEmail) {
                                    toast.error("Ingresa un correo nuevo");
                                    return;
                                }
                                setSavingEmail(true);
                                try {
                                    await api.auth.requestEmailChange({ newEmail: emailForm.newEmail });
                                    toast.success("Revisa tu correo para confirmar");
                                    setEmailForm({ newEmail: "" });
                                } catch (err: any) {
                                    toast.error(err.message || "No se pudo enviar");
                                } finally {
                                    setSavingEmail(false);
                                }
                            }}
                        >
                            <input
                                className="w-full border rounded-xl px-3 py-2"
                                type="email"
                                placeholder="Nuevo correo"
                                value={emailForm.newEmail}
                                onChange={(e) => setEmailForm({ newEmail: e.target.value })}
                            />
                            <button className="btn btn-primary" disabled={savingEmail}>
                                {savingEmail ? "Enviando..." : "Enviar confirmacion"}
                            </button>
                        </form>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold">Cambiar contraseña</h2>
                        <form
                            className="mt-3 space-y-3"
                            onSubmit={async (e) => {
                                e.preventDefault();
                                if (!passwordForm.currentPassword || !passwordForm.newPassword) {
                                    toast.error("Completa todos los campos");
                                    return;
                                }
                                if (passwordForm.newPassword !== passwordForm.confirmPassword) {
                                    toast.error("Las contraseñas no coinciden");
                                    return;
                                }
                                setSaving(true);
                                try {
                                    await api.auth.changePassword({
                                        currentPassword: passwordForm.currentPassword,
                                        newPassword: passwordForm.newPassword,
                                    });
                                    const refreshed = await api.auth.me();
                                    setUser(refreshed as any);
                                    toast.success("Contraseña actualizada");
                                    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                                } catch (err: any) {
                                    toast.error(err.message || "No se pudo actualizar");
                                } finally {
                                    setSaving(false);
                                }
                            }}
                        >
                            <input
                                className="w-full border rounded-xl px-3 py-2"
                                type="password"
                                placeholder="Contraseña actual"
                                value={passwordForm.currentPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                            />
                            <input
                                className="w-full border rounded-xl px-3 py-2"
                                type="password"
                                placeholder="Nueva contraseña"
                                value={passwordForm.newPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                            />
                            <input
                                className="w-full border rounded-xl px-3 py-2"
                                type="password"
                                placeholder="Confirmar nueva contraseña"
                                value={passwordForm.confirmPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                            />
                            <button className="btn btn-primary" disabled={saving}>
                                {saving ? "Guardando..." : "Actualizar contraseña"}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="card">
                    <h2 className="text-lg font-semibold">Tus órdenes</h2>
                    <ul className="mt-3 space-y-2">
                        {orders.data?.map((o: any) => (
                            <li key={o._id} className="border rounded-xl p-3">
                                <p>Orden #{o._id}</p>
                                <p>Items: {o.items.length} — Total: $ {o.amount.toLocaleString("es-CO")}</p>
                                <p className="text-sm opacity-75">{new Date(o.createdAt).toLocaleString()}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}

