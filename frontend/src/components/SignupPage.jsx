import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";

export default function SignupPage() {
    const [form, setForm] = useState({
        username: "",
        password: "",
    });
    const { signUp } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    async function submit(e) {
        e.preventDefault();
        try {
          setError(null);
          setIsSubmitting(true);

          const username = form.username.trim();
          const password = form.password;

          if (!username || !password) {
            setError("Username and password are required");
            return;
          }

          await signUp(username, password);

          navigate("/");
        } catch (err) {
          if (err instanceof Error && err.message) {
            setError(err.message);
          } else {
            setError("Something went wrong");
          }
        } finally {
          setIsSubmitting(false);
        }
    }

    const onChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setError(null);
    };

    return (
      <div className="auth-page">
        <div className="auth-card">
            <h2>Sign up</h2>
            <p className="subtitle">Create a new account</p>
            <form onSubmit={submit}>
              <div className="form-field">
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  name="username"
                  placeholder="Enter username"
                  type="text"
                  value={form.username}
                  onChange={onChange}
                />
              </div>
              <div className="form-field">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  placeholder="Password"
                  type="password"
                  value={form.password}
                  onChange={onChange}
                />
              </div>
              {error && <p className="error-message">{error}</p>}
              <button className="login-submit" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create account"}
              </button>
            </form>
          </div>
        </div>
      );
}
