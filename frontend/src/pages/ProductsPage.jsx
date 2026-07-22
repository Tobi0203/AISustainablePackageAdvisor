import { useEffect, useState } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../lib/api";
import ProductCard from "../components/ProductCard";
import Loading from "../components/Loading";
import { useAuth } from "../context/AuthContext";
export function ProductsPage() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const { user } = useAuth();
  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/products", {
        params: Object.fromEntries(params),
      });
      setProducts(data.products);
    } catch {
      toast.error("Could not load products.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, [params.toString()]);
  useEffect(() => {
    if (user?.role === "customer")
      api
        .get("/favorites")
        .then(({ data }) =>
          setFavorites(data.favorites.map((f) => f.product?._id)),
        )
        .catch(() => {});
  }, [user]);
  const favorite = async (p) => {
    try {
      if (favorites.includes(p._id)) {
        await api.delete(`/favorites/${p._id}`);
        setFavorites((x) => x.filter((id) => id !== p._id));
      } else {
        await api.post("/favorites", { product: p._id });
        setFavorites((x) => [...x, p._id]);
      }
    } catch {
      toast.error("Please sign in as a customer to save favorites.");
    }
  };
  const update = (name, value) => {
    const next = new URLSearchParams(params);
    value ? next.set(name, value) : next.delete(name);
    setParams(next);
  };
  return (
    <section className="py-10">
      <div className="mb-8">
        <span className="text-sm font-semibold text-leaf">MARKETPLACE</span>
        <h1 className="mt-2 text-4xl text-forest">
          Better materials, clearly compared.
        </h1>
      </div>
      <div className="card mb-7 grid gap-3 p-4 md:grid-cols-4">
        <input
          className="input md:col-span-2"
          placeholder="Search materials, products..."
          defaultValue={params.get("search") || ""}
          onKeyDown={(e) =>
            e.key === "Enter" && update("search", e.currentTarget.value)
          }
        />
        <select
          className="input"
          value={params.get("category") || ""}
          onChange={(e) => update("category", e.target.value)}
        >
          <option value="">All categories</option>
          {[
            "boxes",
            "mailers",
            "bags",
            "bottles",
            "containers",
            "wraps",
            "labels",
            "protective",
            "other",
          ].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <select
          className="input"
          value={params.get("minScore") || ""}
          onChange={(e) => update("minScore", e.target.value)}
        >
          <option value="">Any eco score</option>
          <option value="80">80+ score</option>
          <option value="60">60+ score</option>
        </select>
      </div>
      {loading ? (
        <Loading />
      ) : products.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard
              key={p._id}
              product={p}
              favorite={favorites.includes(p._id)}
              onFavorite={user?.role === "customer" ? favorite : null}
            />
          ))}
        </div>
      ) : (
        <Empty
          title="No products found"
          copy="Try a different search term or remove a filter."
        />
      )}
    </section>
  );
}
export function ProductDetailsPage() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { id } = useParams();
  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then(({ data }) => setProduct(data.product))
      .catch(() => toast.error("Product not found."))
      .finally(() => setLoading(false));
  }, [id]);
  if (loading) return <Loading />;
  if (!product) return <Empty title="Product unavailable" />;
  const s = product.sustainability || {};
  return (
    <section className="py-10">
      <div className="grid gap-9 lg:grid-cols-[1.1fr_.9fr]">
        <div className="card flex min-h-80 items-center justify-center bg-gradient-to-br from-mist to-[#d3e9db] text-8xl">
          ♻
        </div>
        <div>
          <span className="rounded-full bg-mist px-3 py-1 text-sm font-semibold text-forest">
            {product.category}
          </span>
          <h1 className="mt-4 text-4xl text-forest">{product.name}</h1>
          <p className="mt-4 leading-7 text-slate-600">{product.description}</p>
          <p className="mt-6 text-2xl font-bold text-forest">
            {product.currency} {product.price}{" "}
            <span className="text-sm font-normal text-slate-500">per unit</span>
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Stat label="Material" value={product.material} />
            <Stat label="Minimum order" value={product.minimumOrderQuantity} />
            <Stat
              label="Lead time"
              value={`${product.leadTimeDays ?? "—"} days`}
            />
            <Stat
              label="Supplier"
              value={product.supplier?.companyName || "Verified partner"}
            />
          </div>
          {user?.role === "customer" && <QuoteForm product={product} />}
        </div>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <Stat label="Eco score" value={`${s.score ?? "—"}/100`} />
        <Stat label="Recyclable" value={s.recyclable ? "Yes" : "No"} />
        <Stat label="Compostable" value={s.compostable ? "Yes" : "No"} />
        <Stat
          label="Recycled content"
          value={`${s.recycledContentPercent ?? 0}%`}
        />
      </div>
    </section>
  );
}
function QuoteForm({ product }) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: { quantity: product.minimumOrderQuantity, notes: "" },
  });
  const submit = async (v) => {
    try {
      await api.post("/quotes", {
        supplier: product.supplier._id,
        product: product._id,
        requirements: {
          productName: product.name,
          quantity: Number(v.quantity),
          materialPreference: product.material,
          notes: v.notes,
        },
      });
      toast.success("Quote request sent to supplier.");
    } catch (e) {
      toast.error(e.response?.data?.message || "Could not send request.");
    }
  };
  return (
    <form
      className="mt-6 rounded-xl bg-mist p-4"
      onSubmit={handleSubmit(submit)}
    >
      <p className="font-semibold text-forest">Request a quote</p>
      <div className="mt-3 flex gap-2">
        <input
          className="input"
          type="number"
          min="1"
          {...register("quantity")}
        />
        <button
          disabled={isSubmitting}
          className="btn-primary whitespace-nowrap"
        >
          Send RFQ
        </button>
      </div>
      <input
        className="input mt-2"
        placeholder="Optional requirements or notes"
        {...register("notes")}
      />
    </form>
  );
}
export const Stat = ({ label, value }) => (
  <div className="rounded-xl border border-[#dfe9e1] bg-white p-4">
    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
      {label}
    </p>
    <p className="mt-1 font-semibold text-forest">{value}</p>
  </div>
);
export const Empty = ({ title, copy }) => (
  <div className="card py-16 text-center">
    <p className="text-xl font-semibold">{title}</p>
    {copy && <p className="mt-2 text-sm text-slate-500">{copy}</p>}
  </div>
);
