import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
const Field = ({ label, error, ...props }) => (
  <label>
    <span className="label">{label}</span>
    <input className="input" {...props} />
    {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
  </label>
);
export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const submit = async (v) => {
    try {
      const user = await login(v);
      toast.success(`Welcome back, ${user.name}`);
      navigate(state?.from || "/dashboard");
    } catch (e) {
      toast.error(e.response?.data?.message || "Unable to sign in.");
    }
  };
  return (
    <AuthShell
      title="Welcome back"
      copy="Sign in to manage your sustainable packaging."
    >
      <form className="space-y-4" onSubmit={handleSubmit(submit)}>
        <Field
          label="Email"
          type="email"
          error={errors.email?.message}
          {...register("email", { required: "Email is required" })}
        />
        <Field
          label="Password"
          type="password"
          error={errors.password?.message}
          {...register("password", { required: "Password is required" })}
        />
        <button disabled={isSubmitting} className="btn-primary w-full">
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-500">
        New here?{" "}
        <Link className="font-semibold text-leaf" to="/register">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}
export function RegisterPage() {
  const { register: signUp } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { role: "customer" } });
  const role = watch("role");
  const submit = async (v) => {
    try {
      const user = await signUp(v);
      toast.success("Account created successfully.");
      navigate(user.role === "supplier" ? "/supplier" : "/dashboard");
    } catch (e) {
      toast.error(e.response?.data?.message || "Unable to create account.");
    }
  };
  return (
    <AuthShell
      title="Build better packaging"
      copy="Create your EcoPack AI workspace."
    >
      <form className="space-y-4" onSubmit={handleSubmit(submit)}>
        <Field
          label="Full name"
          error={errors.name?.message}
          {...register("name", { required: "Name is required" })}
        />
        <Field
          label="Work email"
          type="email"
          error={errors.email?.message}
          {...register("email", { required: "Email is required" })}
        />
        <Field
          label="Password"
          type="password"
          error={errors.password?.message}
          {...register("password", {
            required: "Password is required",
            minLength: { value: 8, message: "Use at least 8 characters" },
          })}
        />
        <label>
          <span className="label">I am joining as</span>
          <select className="input" {...register("role")}>
            <option value="customer">Customer / buyer</option>
            <option value="supplier">Packaging supplier</option>
          </select>
        </label>
        {role === "supplier" && (
          <Field
            label="Company name"
            {...register("companyName", {
              required: "Company name is required for suppliers",
            })}
            error={errors.companyName?.message}
          />
        )}
        <button disabled={isSubmitting} className="btn-primary w-full">
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link className="font-semibold text-leaf" to="/login">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
function AuthShell({ title, copy, children }) {
  return (
    <div className="mx-auto flex min-h-[75vh] max-w-md items-center py-12">
      <div className="card w-full p-7 sm:p-9">
        <Link className="font-bold text-forest" to="/">
          ← EcoPack AI
        </Link>
        <h1 className="mt-7 text-3xl">{title}</h1>
        <p className="mt-2 text-sm text-slate-500">{copy}</p>
        <div className="mt-7">{children}</div>
      </div>
    </div>
  );
}
