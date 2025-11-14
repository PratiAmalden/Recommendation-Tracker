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
      navigate("/profile")
    }
    
  }

  return (
    <div className="auth-page">
      <form onSubmit={submit}>
        <div>
          <label>
            Username
            <input
              name="username"
              placeholder="Enter Username"
              type="text"
              value={form.username}
              onChange={onChange}
            />
          </label>
        </div>
        <div>
          <label> Password </label>
          <input
            name="password"
            placeholder="password"
            value={form.password}
            onChange={onChange}
            type="password"
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button className="login-submit" type="submit">
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}