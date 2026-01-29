import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../lib/api";
import { useQueryParams } from "../hooks/useQueryParams";
import { useSeo } from "../lib/seo";

export default function ResetPassword() {
  const { params } = useQueryParams();
  const navigate = useNavigate();
  const token = useMemo(() => params.get("token") || "", [params]);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  useSeo({
    title: "Restablecer contraseña",
    description: "Cambia tu contraseña de forma segura.",
    canonical: `${import.meta.env.VITE_SITE_URL || window.location.origin}/reset-password`
  });

  return (
    <section className="max-w-md mx-auto space-y-4">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-[hsl(var(--muted))]">Cuenta</p>
        <h1 className="text-2xl font-semibold">Restablecer contraseña</h1>
        <p className="text-sm subtle">Ingresa tu nueva contraseña.</p>
      </div>
      <form
        className="card space-y-3"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!token) {
            toast.error("Token invalido o expirado");
            return;
          }
          if (!password || !confirm) {
            toast.error("Completa todos los campos");
            return;
          }
          if (password !== confirm) {
            toast.error("Las contraseñas no coinciden");
            return;
          }
          setLoading(true);
          try {
            await api.auth.resetPassword({ token, newPassword: password });
            toast.success("Contraseña actualizada");
            navigate("/auth");
          } catch (err: any) {
            toast.error(err.message || "No se pudo restablecer");
          } finally {
            setLoading(false);
          }
        }}
      >
        <input
          className="w-full border rounded-xl px-3 py-2"
          type="password"
          placeholder="Nueva contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          className="w-full border rounded-xl px-3 py-2"
          type="password"
          placeholder="Confirmar contraseña"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
        <button className="btn btn-primary" disabled={loading}>
          {loading ? "Guardando..." : "Actualizar"}
        </button>
      </form>
    </section>
  );
}
