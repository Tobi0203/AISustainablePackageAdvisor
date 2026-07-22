import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../lib/api";
import Loading from "../components/Loading";
import { Stat } from "./ProductsPage";
import { useAuth } from "../context/AuthContext";

const Shell = ({ title, subtitle, children }) => <section className="py-10"><p className="text-sm font-semibold text-leaf">WORKSPACE</p><h1 className="mt-2 text-4xl text-forest">{title}</h1><p className="mt-2 text-slate-500">{subtitle}</p><div className="mt-8">{children}</div></section>;
const Badge = ({ value }) => <span className="rounded-full bg-mist px-3 py-1 text-xs font-semibold capitalize text-forest">{value}</span>;

export function CustomerDashboard() {
  const [quotes, setQuotes] = useState(null); const { user } = useAuth();
  useEffect(() => { const load = async () => { try { const { data } = await api.get("/quotes"); setQuotes(data.quotes); } catch { setQuotes([]); } }; load(); }, []);
  if (!quotes) return <Loading />;
  return <Shell title={`Welcome, ${user.name}`} subtitle="Track your product enquiries and supplier quotations."><div className="grid gap-4 md:grid-cols-3"><Stat label="Open requests" value={quotes.filter((quote) => quote.status === "requested").length} /><Stat label="Quotes received" value={quotes.filter((quote) => quote.status === "quoted").length} /><Stat label="Accepted" value={quotes.filter((quote) => quote.status === "accepted").length} /></div><section className="card mt-7 p-6"><div className="flex justify-between"><h2 className="text-xl">Recent requests</h2><Link className="text-sm font-semibold text-leaf" to="/quotes">View all quotations</Link></div>{quotes.length ? <div className="mt-4 divide-y">{quotes.slice(0, 5).map((quote) => <div className="flex items-center justify-between py-3" key={quote._id}><div><p className="font-medium">{quote.requirements.productName}</p><p className="text-sm text-slate-500">{quote.supplier?.companyName}</p></div><Badge value={quote.status} /></div>)}</div> : <p className="mt-4 text-sm text-slate-500">No requests yet. Browse products and request a quotation.</p>}</section></Shell>;
}

export function SupplierDashboard() {
  const [state, setState] = useState(null); const { supplier } = useAuth();
  useEffect(() => { const load = async () => { try { const [quotes, products] = await Promise.all([api.get("/quotes"), api.get("/products/mine")]); setState({ quotes: quotes.data.quotes, products: products.data.products }); } catch { setState({ quotes: [], products: [] }); } }; load(); }, [supplier?._id]);
  if (!state) return <Loading />;
  return <Shell title="Supplier workspace" subtitle={supplier?.isVerified ? "Your supplier profile is verified." : "Complete your profile while verification is pending."}><div className="grid gap-4 md:grid-cols-3"><Stat label="Listed products" value={state.products.length} /><Stat label="Incoming RFQs" value={state.quotes.filter((quote) => quote.status === "requested").length} /><Stat label="Verification" value={supplier?.isVerified ? "Verified" : "Pending"} /></div><div className="mt-7 flex flex-wrap gap-3"><Link className="btn-primary" to="/supplier/products">Manage products</Link><Link className="btn-secondary" to="/quotes">View RFQs</Link><Link className="btn-secondary" to="/profile">Edit company profile</Link></div></Shell>;
}

export function AdminDashboard() {
  const [state, setState] = useState(null);
  const load = async () => { try { const [users, suppliers] = await Promise.all([api.get("/users"), api.get("/suppliers?verified=false")]); setState({ users: users.data.users, suppliers: suppliers.data.suppliers }); } catch { setState({ users: [], suppliers: [] }); } };
  useEffect(() => { load(); }, []);
  const verify = async (id) => { try { await api.patch(`/suppliers/${id}/verification`, { isVerified: true, verificationNotes: "Verified by administrator." }); toast.success("Supplier verified."); setState((current) => ({ ...current, suppliers: current.suppliers.filter((supplier) => supplier._id !== id) })); } catch (error) { toast.error(error.response?.data?.message || "Could not verify supplier."); } };
  if (!state) return <Loading />;
  return <Shell title="Administration" subtitle="Verify suppliers and oversee marketplace accounts."><div className="grid gap-4 md:grid-cols-3"><Stat label="Registered users" value={state.users.length} /><Stat label="Pending suppliers" value={state.suppliers.length} /><Stat label="Active customers" value={state.users.filter((user) => user.role === "customer" && user.isActive).length} /></div><section className="card mt-7 p-6"><h2 className="text-xl">Supplier verification queue</h2>{state.suppliers.length ? <div className="mt-4 divide-y">{state.suppliers.map((supplier) => <div key={supplier._id} className="flex flex-wrap items-center justify-between gap-3 py-4"><div><p className="font-semibold">{supplier.companyName}</p><p className="text-sm text-slate-500">{supplier.user?.email || "No email available"}</p></div><button className="btn-primary" onClick={() => verify(supplier._id)}>Verify supplier</button></div>)}</div> : <p className="mt-3 text-sm text-slate-500">No suppliers are awaiting verification.</p>}</section></Shell>;
}
