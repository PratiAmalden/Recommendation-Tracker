import { useState } from "react";
import { useAuth } from "../hooks/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  const allowedNames = ["username", "password"];

  const onChange = (e) => {
    const { name, value } = e.target;

    if(!allowedNames.includes(name)){
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  async function submit(e) {
    e.preventDefault();
    try{
      setError(null);
      setIsSubmitting(true);

      const username = form.username.trim();
      const password = form.password;

      if(!username || !password){
        setError("Username and password are required");
        return;
      }

      await login(username, password);
      navigate("/");
    } catch (err) {
      if (err instanceof Error && err.message) {
        setError(err.message);
      } else {
        setError("Something went wrong");
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
                className="input input-bordered bg-black/40 text-accent"
                required
                placeholder="Username"
                pattern="[A-Za-z][A-Za-z0-9\\-]*"
                minLength={3}
                maxLength={30}
                title="Only letters, numbers or dash"
              />
              <p className="validator-hint text-xs text-accent/70 mt-1">
                Must be 3 to 30 characters
                <br />
                containing only letters, numbers or dash
              </p>
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
                className="input validator bg-black/40 text-accent"
                required
                placeholder="Password"
                minLength={8}
                pattern="(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
              />
              <p className="validator-hint text-xs text-accent/70 mt-1">
                Must be more than 8 characters, including
                <br />
                at least one number
                <br />
                at least one lowercase letter
                <br />
                at least one uppercase letter
              </p>
            </div>

            {error && (
              <div className="inline-grid *:[grid-area:1/1] mt-2">
                <div className="status status-error animate-ping"></div>
                <div className="status status-error"></div>
                <p className="text-sm text-error mt-1">{error}</p>
              </div>
            )}

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