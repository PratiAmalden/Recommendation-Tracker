import { createContext, useContext ,useEffect, useState } from "react";

const AuthContext = createContext(undefined);

export function AuthProvider({ children, onLogin }){
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        checkAuth();
    }, []);

    // Check with the server
    async function checkAuth(){
        try{
            const res = await fetch("/api/me", {
                credentials: 'include',
            });
            if(!res.ok){
                throw new Error("Session expired")
            }
            const data = await res.json();
            setUser(data.user || data);
        } catch (err){
            console.error("Auth check failed", err);
            setUser(null);
        } finally{
            setIsLoading(false);
        }
    }
    async function login(username, password){
        setError("")
        setIsLoading(true)
        try{
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include',
            body: JSON.stringify({ username, password })
        });

        if(!res.ok){
            const error = await res.json()
            throw new Error(error.error || 'Failed to login')
        }

        const data = await res.json();

        setUser(data.user || data);
        onLogin?.(data.user || data);
        } catch(err){
            setError(err.message || 'Failed to login');
            setUser(null);
        } finally{
            setIsLoading(false);
        }
    }

    async function signUp(username, password){
        setIsLoading(true);
        try{
            const res = await fetch("/api/signup", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ username, password })
            });

            if(!res.ok){
                const error = await res.json();
                throw new Error(error.error || "Failed to sign up");
            }

            const data = await res.json();
            setUser(data.user || data);
            
        } catch (err) {
            setError(err.message || 'Failed to sign up')
        } finally{
            setIsLoading(false)
        }
    }

    async function logOut(){
        try{
            const res = await fetch("/api/logout", {
                method: 'POST',
                credentials: 'include',
            });
            setUser(null)
        } catch (err){
            console.error("Logout failed", err)
        }
    }
    return (
        <AuthContext.Provider value={{ user, isLoading, error, login, signUp,logOut }}>
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