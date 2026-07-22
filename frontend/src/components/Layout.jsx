import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCompare } from "../context/CompareContext";
const links = [
  { to: "/products", label: "Explore products" },
  { to: "/suppliers", label: "Suppliers" },
  { to: "/ai-advisor", label: "AI adviser" },
];
export function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCompare();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const exit = async () => {
    await logout();
    navigate("/");
  };
  return (
    <header className="sticky top-0 z-30 border-b border-[#e2ece4] bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-bold text-forest">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-forest text-lg text-white">
            ◒
          </span>
          EcoPack AI
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className="text-sm font-medium text-slate-600 hover:text-forest"
            >
              {l.label}
            </NavLink>
          ))}
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <Link to="/compare" className="text-sm font-medium text-slate-600">
            Compare{items.length ? ` (${items.length})` : ""}
          </Link>
          {user ? (
            <>
              <Link className="btn-secondary" to="/dashboard">
                Dashboard
              </Link>
              <button className="text-sm text-slate-500" onClick={exit}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link className="text-sm font-medium text-forest" to="/login">
                Sign in
              </Link>
              <Link className="btn-primary" to="/register">
                Get started
              </Link>
            </>
          )}
        </div>
        <button
          className="text-2xl md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          ☰
        </button>
      </nav>
      {open && (
        <div className="border-t bg-white px-5 py-4 md:hidden">
          <div className="grid gap-3">
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            <Link to="/compare">Compare ({items.length})</Link>
            {user ? (
              <Link to="/dashboard">Dashboard</Link>
            ) : (
              <Link to="/login">Sign in</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
export function Footer() {
  return (
    <footer className="mt-20 border-t border-[#dfe9e1] bg-white">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 px-6 py-9 text-sm text-slate-500 sm:flex-row">
        <p>
          © {new Date().getFullYear()} EcoPack AI. Better packaging, lighter
          footprint.
        </p>
        <div className="flex gap-5">
          <Link to="/products">Marketplace</Link>
          <Link to="/suppliers">Verified suppliers</Link>
        </div>
      </div>
    </footer>
  );
}
export default function Layout() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
