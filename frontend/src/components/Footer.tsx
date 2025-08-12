export default function Footer() {
    return (
        <footer className="border-t mt-10">
            <div className="container mx-auto px-4 py-6 text-sm opacity-70 flex items-center justify-between">
                <span>{import.meta.env.VITE_APP_NAME} © {new Date().getFullYear()}</span>
                <span>Hecho con ❤️</span>
            </div>
        </footer>
    );
}
