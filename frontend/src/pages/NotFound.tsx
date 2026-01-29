import { useSeo } from "../lib/seo";

export default function NotFound() {
    useSeo({
        title: "Pagina no encontrada",
        description: "No encontramos la pagina que buscas.",
        canonical: `${import.meta.env.VITE_SITE_URL || window.location.origin}/404`
    });
    return <p className="py-20 text-center">Pagina no encontrada</p>;
}

