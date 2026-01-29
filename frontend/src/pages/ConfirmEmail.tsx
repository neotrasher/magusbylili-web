import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../lib/api";
import { useQueryParams } from "../hooks/useQueryParams";
import { useAuth } from "../store/auth";
import { useSeo } from "../lib/seo";

export default function ConfirmEmail() {
  const { params } = useQueryParams();
  const navigate = useNavigate();
  const setUser = useAuth((s) => s.setUser);
  const token = useMemo(() => params.get("token") || "", [params]);
  const [loading, setLoading] = useState(false);

  useSeo({
    title: "Confirmar correo",
    description: "Confirma tu nuevo correo para actualizar tu cuenta.",
    canonical: `${import.meta.env.VITE_SITE_URL || window.location.origin}/confirm-email`
  });

  return (
    <section className="max-w-md mx-auto space-y-4">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-[hsl(var(--muted))]">Cuenta</p>
        <h1 className="text-2xl font-semibold">Confirmar nuevo correo</h1>
        <p className="text-sm subtle">Confirma tu nuevo correo para actualizarlo.</p>
      </div>
      <div className="card space-y-3">
        <button
          className="btn btn-primary"
          disabled={loading}
          onClick={async () => {
            if (!token) {
              toast.error("Token invalido o expirado");
              return;
            }
            setLoading(true);
            try {
              await api.auth.confirmEmailChange({ token });
              const updated = await api.auth.me();
              setUser(updated as any);
              toast.success("Correo actualizado");
              navigate("/account");
            } catch (err: any) {
              toast.error(err.message || "No se pudo confirmar");
            } finally {
              setLoading(false);
            }
          }}
        >
          {loading ? "Confirmando..." : "Confirmar correo"}
        </button>
      </div>
    </section>
  );
}
