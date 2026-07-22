import { useEffect, useState } from "react";
import api from "../lib/api";
import Loading from "../components/Loading";
import { Empty } from "./ProductsPage";
export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState(null);
  const [query, setQuery] = useState("");
  const load = async () => {
    setSuppliers(null);
    try {
      const { data } = await api.get("/suppliers", {
        params: query ? { search: query } : {},
      });
      setSuppliers(data.suppliers);
    } catch {
      setSuppliers([]);
    }
  };
  useEffect(() => {
    load();
  }, []);
  return (
    <section className="py-10">
      <h1 className="text-4xl text-forest">Verified packaging suppliers</h1>
      <p className="mt-2 text-slate-500">
        Build a resilient, lower-impact supply chain.
      </p>
      <div className="mt-7 flex gap-3">
        <input
          className="input"
          placeholder="Search suppliers or materials"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load()}
        />
        <button className="btn-primary" onClick={load}>
          Search
        </button>
      </div>
      {!suppliers ? (
        <Loading />
      ) : suppliers.length ? (
        <div className="mt-7 grid gap-5 md:grid-cols-2">
          {suppliers.map((s) => (
            <article className="card p-6" key={s._id}>
              <div className="flex justify-between gap-4">
                <div>
                  <h2 className="text-xl">{s.companyName}</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {s.address?.city || "Global"} ·{" "}
                    {s.address?.country || "Supplier"}
                  </p>
                </div>
                {s.isVerified && (
                  <span className="h-fit rounded-full bg-mist px-3 py-1 text-xs font-bold text-forest">
                    ✓ Verified
                  </span>
                )}
              </div>
              <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-600">
                {s.description || "Sustainable packaging partner."}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {(s.materials || []).slice(0, 4).map((m) => (
                  <span
                    className="rounded-full bg-slate-100 px-2.5 py-1 text-xs"
                    key={m}
                  >
                    {m}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-8">
          <Empty title="No suppliers found" />
        </div>
      )}
    </section>
  );
}
