import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../lib/api";
import Loading from "../components/Loading";
const preferences = [
  ["balanced", "Balanced"],
  ["recyclable", "Recyclable"],
  ["compostable", "Compostable"],
  ["lowest-carbon", "Lowest carbon"],
  ["reusable", "Reusable"],
];
export default function AiAdvisorPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      fragility: "medium",
      sustainabilityPreference: "balanced",
    },
  });
  const [result, setResult] = useState(null);
  const submit = async (values) => {
    try {
      const { data } = await api.post("/ai/recommendations", values);
      setResult(data.recommendation);
    } catch (e) {
      toast.error(
        e.response?.data?.message || "Could not generate a recommendation.",
      );
    }
  };
  return (
    <section className="py-10">
      <span className="text-sm font-semibold text-leaf">
        AI PACKAGING ADVISER
      </span>
      <h1 className="mt-2 text-4xl text-forest">
        Find the right package in minutes.
      </h1>
      <p className="mt-2 max-w-2xl text-slate-500">
        Share your requirements and get an explainable material recommendation,
        estimated costs and practical alternatives. Estimates are for planning,
        not supplier quotes.
      </p>
      <div className="mt-8 grid gap-7 lg:grid-cols-[.85fr_1.15fr]">
        <form className="card space-y-4 p-6" onSubmit={handleSubmit(submit)}>
          <Field label="Product type" error={errors.productType?.message}>
            <input
              className="input"
              placeholder="e.g. glass skincare bottle"
              {...register("productType", {
                required: "Product type is required",
              })}
            />
          </Field>
          <Field label="Product weight" error={errors.weight?.message}>
            <input
              className="input"
              placeholder="e.g. 350 g"
              {...register("weight", { required: "Weight is required" })}
            />
          </Field>
          <Field label="Packaging budget" error={errors.budget?.message}>
            <input
              className="input"
              placeholder="e.g. $1.20 per unit"
              {...register("budget", { required: "Budget is required" })}
            />
          </Field>
          <Field label="Fragility">
            <select className="input" {...register("fragility")}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </Field>
          <Field
            label="Shipping destination"
            error={errors.destination?.message}
          >
            <input
              className="input"
              placeholder="e.g. Mumbai, India"
              {...register("destination", {
                required: "Destination is required",
              })}
            />
          </Field>
          <Field label="Sustainability priority">
            <select className="input" {...register("sustainabilityPreference")}>
              {preferences.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
          <button className="btn-primary w-full" disabled={isSubmitting}>
            {isSubmitting
              ? "Analysing requirements..."
              : "Get AI recommendation"}
          </button>
        </form>
        <Result result={result} loading={isSubmitting} />
      </div>
    </section>
  );
}
function Result({ result, loading }) {
  if (loading)
    return (
      <div className="card">
        <Loading text="Weighing protection, cost and sustainability..." />
      </div>
    );
  if (!result)
    return (
      <div className="card grid min-h-96 place-items-center p-8 text-center">
        <div>
          <p className="text-5xl">✦</p>
          <h2 className="mt-4 text-2xl text-forest">Your packaging brief</h2>
          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
            Complete the form to receive a tailored, explainable recommendation.
          </p>
        </div>
      </div>
    );
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      <div className="card overflow-hidden">
        <div className="bg-forest p-6 text-white">
          <p className="text-xs font-bold tracking-widest text-[#bde6c9]">
            BEST MATERIAL
          </p>
          <h2 className="mt-2 text-3xl">{result.bestMaterial}</h2>
          <p className="mt-3 leading-6 text-white/80">{result.explanation}</p>
        </div>
        <div className="grid grid-cols-2 gap-px bg-[#dfe9e1] sm:grid-cols-3">
          <Metric label="Eco score" value={`${result.ecoScore}/100`} />
          <Metric
            label="Estimated cost"
            value={`${result.estimatedCost?.currency || ""} ${result.estimatedCost?.low}–${result.estimatedCost?.high}`}
          />
          <Metric label="Basis" value={result.estimatedCost?.basis} />
        </div>
      </div>
      {result.disposalGuidance && (
        <div className="rounded-xl bg-mist p-4 text-sm text-forest">
          <b>End-of-life guidance:</b> {result.disposalGuidance}
        </div>
      )}
      <div>
        <h3 className="mb-3 text-xl">Alternative materials</h3>
        <div className="grid gap-3">
          {result.alternatives?.map((a, i) => (
            <div
              className="card flex items-start justify-between gap-4 p-4"
              key={`${a.material}-${i}`}
            >
              <div>
                <p className="font-semibold">{a.material}</p>
                <p className="mt-1 text-sm text-slate-500">{a.tradeoff}</p>
              </div>
              <div className="text-right text-sm">
                <b className="text-leaf">{a.ecoScore}/100</b>
                <p className="text-slate-500">{a.estimatedCost}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
const Field = ({ label, error, children }) => (
  <label className="block">
    <span className="label">{label}</span>
    {children}
    {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
  </label>
);
const Metric = ({ label, value }) => (
  <div className="bg-white p-4">
    <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
    <p className="mt-1 break-words font-bold text-forest">{value}</p>
  </div>
);
