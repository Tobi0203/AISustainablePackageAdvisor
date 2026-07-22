import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../lib/api";
import Loading from "../components/Loading";
import ProductCard from "../components/ProductCard";
import { useAuth } from "../context/AuthContext";
import { useCompare } from "../context/CompareContext";
import { Empty } from "./ProductsPage";
export function FavoritesPage() {
  const [favorites, setFavorites] = useState(null);
  useEffect(() => {
    api
      .get("/favorites")
      .then(({ data }) => setFavorites(data.favorites))
      .catch(() => setFavorites([]));
  }, []);
  const remove = async (p) => {
    await api.delete(`/favorites/${p._id}`);
    setFavorites((x) => x.filter((f) => f.product._id !== p._id));
    toast.success("Removed from favorites");
  };
  if (!favorites) return <Loading />;
  return (
    <section className="py-10">
      <h1 className="text-4xl text-forest">Saved products</h1>
      <p className="mt-2 text-slate-500">
        Keep your strongest packaging options close.
      </p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {favorites.map((f) => (
          <ProductCard
            key={f._id}
            product={f.product}
            favorite
            onFavorite={remove}
          />
        ))}
      </div>
      {!favorites.length && (
        <div className="mt-8">
          <Empty
            title="No favorites yet"
            copy="Save products while you explore the marketplace."
          />
        </div>
      )}
    </section>
  );
}
export function ComparePage() {
  const { items, clear } = useCompare();
  if (!items.length)
    return (
      <section className="py-10">
        <Empty
          title="Your comparison is empty"
          copy="Choose up to three products from the marketplace to compare them."
        />
      </section>
    );
  const rows = [
    ["Material", (p) => p.material],
    ["Price", (p) => `${p.currency} ${p.price}`],
    ["Eco score", (p) => `${p.sustainability?.score ?? "—"}/100`],
    ["Recyclable", (p) => (p.sustainability?.recyclable ? "Yes" : "No")],
    ["MOQ", (p) => p.minimumOrderQuantity],
  ];
  return (
    <section className="py-10">
      <div className="flex justify-between">
        <div>
          <h1 className="text-4xl text-forest">Compare products</h1>
          <p className="mt-2 text-slate-500">
            Find the best fit for your requirements.
          </p>
        </div>
        <button className="btn-secondary" onClick={clear}>
          Clear
        </button>
      </div>
      <div className="card mt-8 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b bg-mist">
              <th className="p-4">Attribute</th>
              {items.map((p) => (
                <th className="min-w-44 p-4" key={p._id}>
                  {p.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, fn]) => (
              <tr className="border-b" key={label}>
                <td className="p-4 font-semibold text-slate-600">{label}</td>
                {items.map((p) => (
                  <td className="p-4" key={p._id}>
                    {fn(p)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
export function ProfilePage() {
  const { user, supplier, refresh } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    values: {
      name: user?.name || "",
      companyName: supplier?.companyName || user?.companyName || "",
      phone: supplier?.phone || user?.phone || "",
      description: supplier?.description || "",
      materials: (supplier?.materials || []).join(", "),
    },
  });
  const save = async (v) => {
    try {
      await api.patch("/users/me", v);
      if (user.role === "supplier")
        await api.patch("/suppliers/me", {
          companyName: v.companyName,
          phone: v.phone,
          description: v.description,
          materials: v.materials
            .split(",")
            .map((x) => x.trim())
            .filter(Boolean),
        });
      await refresh();
      toast.success("Profile updated");
    } catch (e) {
      toast.error(e.response?.data?.message || "Could not update profile");
    }
  };
  return (
    <section className="mx-auto max-w-2xl py-10">
      <h1 className="text-4xl text-forest">Profile</h1>
      <form className="card mt-7 space-y-4 p-6" onSubmit={handleSubmit(save)}>
        {[
          ["name", "Name"],
          ["companyName", "Company"],
          ["phone", "Phone"],
        ].map(([key, label]) => (
          <label key={key}>
            <span className="label">{label}</span>
            <input className="input" {...register(key)} />
          </label>
        ))}
        {user?.role === "supplier" && (
          <>
            <label>
              <span className="label">Company description</span>
              <textarea
                className="input min-h-24"
                {...register("description")}
              />
            </label>
            <label>
              <span className="label">Materials (comma separated)</span>
              <input className="input" {...register("materials")} />
            </label>
          </>
        )}
        <label>
          <span className="label">Email</span>
          <input
            className="input bg-slate-50"
            disabled
            value={user?.email || ""}
          />
        </label>
        <button className="btn-primary" disabled={isSubmitting}>
          Save changes
        </button>
      </form>
    </section>
  );
}
export function SettingsPage() {
  const { user, logout } = useAuth();
  return (
    <section className="mx-auto max-w-2xl py-10">
      <h1 className="text-4xl text-forest">Settings</h1>
      <div className="card mt-7 p-6">
        <h2 className="text-xl">Account</h2>
        <p className="mt-2 text-sm text-slate-500">
          You are signed in as {user?.email} with a {user?.role} account.
        </p>
        <button className="btn-secondary mt-5" onClick={logout}>
          Sign out from this device
        </button>
      </div>
    </section>
  );
}
