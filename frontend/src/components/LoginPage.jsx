import { useState } from "react";
import { useAuth } from "../hooks/AuthContext";
import { useNavigate,Link } from "react-router-dom";
import { loginSchema, zodToFieldErrors } from "../utils/validationSchemas";


export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState({});
  
  const navigate = useNavigate();

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error[name]) {
      setError((prev) => ({ ...prev, [name]: null }));
    }
  };

  async function submit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setError({});

    const validationResult = loginSchema.safeParse(form);

    if (!validationResult.success) {
      setError(zodToFieldErrors(validationResult.error.issues));
      setIsSubmitting(false);
      return;
    }

    try {
      await login(form.username, form.password);
      navigate("/");
    } catch (err) {
      if (err instanceof Error && err.message) {
        setError({ root: err.message });
      } else {
        setError({ root: "Something went wrong" });
      }
    } finally{
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-page min-h-[70vh] flex items-center justify-center">
      <div className="auth-card card w-full max-w-md bg-neutral text-neutral-accent shadow-xl border border-primary">
        <div className="card-body">
          <h2 className="font-jersey text-3xl text-primary tracking-[0.2em]">
            Log in
          </h2>
          <p className="subtitle text-sm text-accent/80 mb-4">
            Access your account
          </p>
          <form onSubmit={submit} className="space-y-4">
            <div className="form-field form-control">
              <label 
                htmlFor="username" 
                className="label text-sm font-semibold text-accent m-2"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={form.username}
                onChange={onChange}
                className={`input input-bordered bg-black/40 text-accent ${error.username ? "input-error border-error" : ""}`}
                placeholder="Username"
              />
              {error.username && <p className="text-xs text-error mt-1">{error.username}</p>}
            </div>

            <div className="form-field form-control">
              <label
                htmlFor="password"
                className="label text-sm font-semibold text-accent m-2"
               >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={form.password}
                onChange={onChange}
                className={`input input-bordered bg-black/40 text-accent ${error.password ? "input-error border-error" : ""}`}
                placeholder="Password"
              />
              {error.password && <p className="text-xs text-error mt-1">{error.password}</p>}
            </div>

            {error.root && (
              <div className="mt-2 text-center">
                <p className="text-sm text-error font-bold">{error.root}</p>
              </div>
            )}
          
            <div className="flex justify-end">
              <Link
              to ="/forgot-password"
              className="text-sm text-primary hover:underline">
              Forgot Password?
              </Link>
            </div>

            <button
              className="login-submit btn btn-primary w-full bg-primary border-primary text-black hover:bg-accent hover:border-accent font-jersey text-xl tracking-[0.15em] mt-4"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Log in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}