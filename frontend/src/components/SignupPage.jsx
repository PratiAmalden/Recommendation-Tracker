import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
import { authSchema } from "../utils/validationSchemas"; 

export default function SignupPage() {
    const [form, setForm] = useState({
        username: "",
        password: "",
    });
    const { signUp } = useAuth();
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

        const validationResult = authSchema.safeParse(form);

        if (!validationResult.success) {
            const fieldErrors = {};
            validationResult.error.issues.forEach((issue) => {
              const fieldName = issue.path[0];
              if (!fieldErrors[fieldName]) {
                fieldErrors[fieldName] = issue.message;
            }
            });
            setError(fieldErrors);
            setIsSubmitting(false);
            return;
        }

        try {
          await signUp(form.username, form.password);
          navigate("/");
        } catch (err) {
          if (err instanceof Error && err.message) {
            setError({ root: err.message });
          } else {
            setError({ root: "Something went wrong" });
          }
        } finally {
          setIsSubmitting(false);
        }
    }

    return (
        <div className="auth-page min-h-[70vh] flex items-center justify-center">
          <div className="auth-card card w-full max-w-md bg-neutral text-neutral-content shadow-xl border border-primary">
            <div className="card-body">
              <h2 className="font-jersey text-3xl text-primary tracking-[0.2em]">
                Sign up
              </h2>
              <p className="subtitle text-sm text-accent/80 mb-4">
                Create a new account
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
                    placeholder="Enter username"
                    type="text"
                    value={form.username}
                    onChange={onChange}
                    className={`input input-bordered text-accent ${error.username ? "input-error border-error" : ""}`}
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
                    id="password"
                    name="password"
                    placeholder="Password"
                    type="password"
                    value={form.password}
                    onChange={onChange}
                    className={`input input-bordered text-accent ${error.password ? "input-error border-error" : ""}`}
                  />
                  {error.password && <p className="text-xs text-error mt-1">{error.password}</p>}
                </div>
                {error.root && (
                  <p className="error-message text-sm text-error mt-1 text-center font-bold">
                    {error.root}
                  </p>
                )}
                <button
                  className="login-submit btn btn-primary w-full bg-primary border-primary text-black hover:bg-accent hover:border-accent font-jersey text-xl tracking-[0.15em] mt-4"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create account"}
                </button>
              </form>
            </div>
          </div>
        </div>
      );
}
