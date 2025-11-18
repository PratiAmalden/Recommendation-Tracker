import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";

export default function SignupPage() {
    const [form, setForm] = useState({
        username: "",
        password: "",
    });
    const { signUp, error, isLoading } = useAuth();
    const navigate = useNavigate();

    async function submit(e) {
        e.preventDefault();
        if (!form.username || !form.password) {
          alert("Username and password are required");
          return;
        }
        const ok = await signUp(form.username, form.password);
        if (ok) {
          navigate("/profile");
        }
    }

    const onChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
              <button className="login-submit" type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create account"}
              </button>
            </form>
          </div>
        </div>
      );
}
