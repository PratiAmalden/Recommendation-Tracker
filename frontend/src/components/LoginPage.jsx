import { useState } from "react";
import { useAuth } from "../hooks/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const { login, error, isLoading } = useAuth();
  const navigate = useNavigate();

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  async function submit(e) {
    e.preventDefault();
    if(!form.username || !form.password){
      alert("Username and password are required");
      return;
    }
    const ok = await login(form.username, form.password);
    if(ok){
      navigate("/profile");
    }
    
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Log in</h2>
        <p className="subtitle">Access your account</p>
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
            {isLoading ? "Logging in..." : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
}