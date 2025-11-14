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
        <h2>Sign up</h2>
        <form onSubmit={submit}>
            <div>
            <label>
                Username
                <input
                name="username"
                placeholder="Enter username"
                value={form.username}
                type="text"
                onChange={onChange}
                />
            </label>
            </div>
            <div>
            <label>
                Password
                <input
                name="password"
                placeholder="password"
                value={form.password}
                onChange={onChange}
                type="password"
                />
            </label>
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button className="login-submit" type="submit">
            {isLoading ? "Creating..." : "Create account"}
            </button>
        </form>
        </div>
    );
}
