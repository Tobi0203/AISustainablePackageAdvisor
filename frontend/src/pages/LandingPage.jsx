import { Link } from "react-router-dom";
import { motion } from "framer-motion";
const features = [
  ["AI guidance", "Turn product needs into practical packaging options."],
  [
    "Verified sourcing",
    "Find suppliers with transparent sustainability credentials.",
  ],
  ["Clear trade-offs", "Compare cost, protection and environmental impact."],
];
export default function LandingPage() {
  return (
    <>
      <section className="grid min-h-[570px] items-center gap-12 py-16 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="rounded-full bg-mist px-3 py-1.5 text-sm font-semibold text-forest">
            Sustainable sourcing, made clear
          </span>
          <h1 className="mt-6 text-5xl leading-[1.05] text-forest sm:text-6xl">
            Packaging choices that feel{" "}
            <span className="text-leaf">smarter.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            EcoPack AI helps growing businesses discover low-impact packaging
            and connect with suppliers who can deliver it.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="btn-primary px-6 py-3" to="/register">
              Find your packaging
            </Link>
            <Link className="btn-secondary px-6 py-3" to="/products">
              Explore marketplace
            </Link>
          </div>
          <p className="mt-5 text-sm text-slate-500">
            Built for brands, procurement teams and packaging suppliers.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="card relative overflow-hidden bg-forest p-8 text-white shadow-glow"
        >
          <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-leaf/50" />
          <p className="relative text-sm font-semibold text-[#bde6c9]">
            RECOMMENDED FOR YOU
          </p>
          <h2 className="relative mt-4 text-3xl">Recycled kraft mailers</h2>
          <p className="relative mt-3 max-w-sm text-white/75">
            A light, curbside-recyclable shipping choice for your
            direct-to-consumer orders.
          </p>
          <div className="relative mt-8 grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-white/10 p-3">
              <b className="block text-xl">92</b>
              <span className="text-xs text-white/65">Eco score</span>
            </div>
            <div className="rounded-xl bg-white/10 p-3">
              <b className="block text-xl">18%</b>
              <span className="text-xs text-white/65">Less material</span>
            </div>
            <div className="rounded-xl bg-white/10 p-3">
              <b className="block text-xl">12</b>
              <span className="text-xs text-white/65">Suppliers</span>
            </div>
          </div>
        </motion.div>
      </section>
      <section className="grid gap-5 pb-8 md:grid-cols-3">
        {features.map(([title, copy]) => (
          <div className="card p-6" key={title}>
            <span className="text-2xl">✦</span>
            <h3 className="mt-4 text-xl">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">{copy}</p>
          </div>
        ))}
      </section>
    </>
  );
}
