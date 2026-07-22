import { Link } from "react-router-dom";
export default function NotFoundPage() {
  return (
    <section className="grid min-h-[60vh] place-items-center text-center">
      <div>
        <p className="text-7xl">🌱</p>
        <h1 className="mt-4 text-4xl text-forest">Page not found</h1>
        <p className="mt-2 text-slate-500">This path has not taken root yet.</p>
        <Link className="btn-primary mt-6" to="/">
          Return home
        </Link>
      </div>
    </section>
  );
}
