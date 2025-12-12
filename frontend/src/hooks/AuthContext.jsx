import { createContext, useContext ,useEffect, useState } from "react";

// Get the API URL from environment variables
const BASE_URL = import.meta.env.VITE_API_URL;

const API = `${BASE_URL}/api/auth`;
const AuthContext = createContext(undefined);

export function AuthProvider({ children }){
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [token, setToken] = useState( () => localStorage.getItem("token") || "");

    useEffect(() => {
        checkAuth();
    }, []);

    // Check with the server
    async function checkAuth(){
        if(!token){
            setUser(null);
            setIsLoading(false);
            return;
        }
        try{
            const res = await fetch(`${API}/me`, {
                headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if(!res.ok){
                throw new Error("Session expired")
            }

            const data = await res.json();
            setUser(data.user);
        } catch (err){
            console.error("Auth check failed", err);
            localStorage.removeItem("token");
            setToken("");
            setUser(null);
        } finally{
            setIsLoading(false);
        }
    }
    async function login(username, password){
        const res = await fetch(`${API}/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        if(!res.ok){
            const error = await res.json().catch(() => null);
            throw new Error(error?.error || 'Failed to login')
        }

        const data = await res.json();

        setUser(data.user);
        setToken(data.token);
        localStorage.setItem("token", data.token);
    }

    async function signUp(username, password,email){
        const res = await fetch(`${API}/signup`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password,email }),
        });

        if(!res.ok){
            const error = await res.json().catch(() => null);
            throw new Error(error?.error || "Failed to sign up");
        }

        const data = await res.json();
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem("token", data.token); 
    }

    async function logOut() {
      try {
        await fetch(`${API}/logout`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
      } catch (err) {
        console.error("Logout failed", err);
      } finally {
        setUser(null);
        setToken("");
        localStorage.removeItem("token");
      }
    }

    async function resetPassword(token, password) {
        const res = await fetch(`${API}/reset-password`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ token, password }), // Send both the token and new password
        });

        if (!res.ok) {
            const error = await res.json().catch(() => null);
            throw new Error(error?.error || "Failed to reset password");
        }
        
        
        return res.json(); 
    }


    return (
        <AuthContext.Provider value={{ user, isLoading, token, login, signUp,logOut,resetPassword }}>
            {children}
        </AuthContext.Provider>
    );
}

// to use Auth context anywhere
export function useAuth() {
    const context = useContext(AuthContext);
    if(context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}