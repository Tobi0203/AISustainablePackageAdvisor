import { Link } from "react-router-dom";
import { useCompare } from "../context/CompareContext";
export default function ProductCard({ product, favorite, onFavorite }) {
  const { items, toggle } = useCompare();
  const selected = items.some((i) => i._id === product._id);
  return (
    <article className="card group overflow-hidden">
      <div className="flex h-36 items-center justify-center bg-gradient-to-br from-mist to-[#d8ecdf] text-5xl">
        ♻
      </div>
      <div className="p-5">
        <div className="mb-2 flex items-start justify-between gap-2">
          <span className="rounded-full bg-mist px-2.5 py-1 text-xs font-semibold text-forest">
            {product.material}
          </span>
          <span className="text-sm font-bold text-leaf">
            {product.sustainability?.score || "—"}/100
          </span>
        </div>
        <Link
          to={`/products/${product._id}`}
          className="line-clamp-1 text-lg font-semibold hover:text-leaf"
        >
          {product.name}
        </Link>
        <p className="mt-1 line-clamp-2 text-sm text-slate-500">
          {product.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <span className="font-bold text-forest">
              {product.currency} {product.price}
            </span>
            <span className="text-xs text-slate-500"> / unit</span>
          </div>
          <span className="text-xs text-slate-500">
            MOQ {product.minimumOrderQuantity}
          </span>
        </div>
        <div className="mt-4 flex gap-2">
          <Link className="btn-primary flex-1" to={`/products/${product._id}`}>
            Details
          </Link>
          <button
            className="btn-secondary px-3"
            onClick={() => toggle(product)}
            title="Compare"
          >
            {selected ? "✓" : "⇄"}
          </button>
          {onFavorite && (
            <button
              className="btn-secondary px-3"
              onClick={() => onFavorite(product)}
            >
              {favorite ? "♥" : "♡"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
