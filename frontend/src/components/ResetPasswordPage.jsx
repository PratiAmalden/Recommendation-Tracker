import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
import { resetPasswordSchema, zodToFieldErrors } from "../utils/validationSchemas"; 

export default function ResetPasswordPage() {
    // State for New Password Fields
    const [form, setForm] = useState({
        password: "",
        confirmPassword: ""
    });

    //  State for UI feedback
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    //  Hooks for Navigation and Token Extraction
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { resetPassword } = useAuth(); 

    //  Extract the token 
    const token = searchParams.get('token');

  
    useEffect(() => {
        if (!token) {
            setError("Password reset link is missing or invalid. Please request a new one.");
        }
    }, [token]);


    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setError(null);
        setMessage(null);
    };

    async function submit(e) {
        e.preventDefault();
        setError(null);
        setMessage(null);
        setIsSubmitting(true);

        if (!token) {
            setError("Cannot proceed. Reset token is missing.");
            setIsSubmitting(false);
            return;
        }

        const { password } = form; 
        
        try {
       
            resetPasswordSchema.parse(form); 
        } catch (err) {
        
            const fieldErrors = zodToFieldErrors(err.issues);
            

            setError(fieldErrors.password || fieldErrors.confirmPassword); 
            setIsSubmitting(false);
            return;
        }
        
        // 6. API Call
        try {
           
            await resetPassword(token, password); 

            setMessage("Success! Your password has been reset. Redirecting to login...");
            
            // Redirect the user to the login page after a brief delay
            setTimeout(() => {
                navigate("/login");
            }, 3000);

        } catch (err) {
            // Handle errors like 'Token expired' or 'Invalid token' from the backend
            setError(err.message || "Failed to reset password. Please try requesting a new link.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="auth-page min-h-[70vh] flex items-center justify-center">
            <div className="auth-card card w-full max-w-md bg-neutral text-neutral-content shadow-xl border border-primary">
                <div className="card-body">
                    <h2 className="font-jersey text-3xl text-primary tracking-[0.2em]">
                        Set New Password
                    </h2>
                    
                    {token ? (
                        <p className="subtitle text-sm text-accent/80 mb-4">
                            Enter your new password below.
                        </p>
                    ) : (
                        <p className="subtitle text-sm text-error/80 mb-4">
                            Invalid or missing reset link.
                        </p>
                    )}

                    <form onSubmit={submit} className="space-y-4">
                        {/* New Password Input */}
                        <div className="form-field form-control">
                            <label htmlFor="password" className="label text-sm font-semibold text-accent m-2">
                                New Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={form.password}
                                onChange={onChange}
                                className="input input-bordered text-accent"
                                required
                            />
                        </div>

                        {/* Confirm Password Input */}
                        <div className="form-field form-control">
                            <label htmlFor="confirmPassword" className="label text-sm font-semibold text-accent m-2">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={form.confirmPassword}
                                onChange={onChange}
                                className="input input-bordered text-accent"
                                required
                            />
                        </div>

                        {(error || message) && (
                            <p className={`text-sm ${error ? 'text-error' : 'text-success'} mt-1`}>
                                {error || message}
                            </p>
                        )}
                        
                        <button
                            className="btn btn-primary w-full bg-primary border-primary text-black hover:bg-accent hover:border-accent font-jersey text-xl tracking-[0.15em] mt-4"
                            type="submit"
                            disabled={isSubmitting || !token}
                        >
                            {isSubmitting ? "Setting Password..." : "Reset Password"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}