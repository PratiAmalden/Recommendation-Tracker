
import { useState } from "react";
import {useAuth} from "../hooks/AuthContext";
import { emailSchema, zodToFieldErrors } from "../utils/validationSchemas";

export default function ForgotPasswordPage(){

    const [email,setEmail]= useState("");
    const [message,setMessage] = useState("");
    const [validationError,setValidationError] = useState(null);
    const [requestError,setRequestError] = useState(null);
    const [isSubmitting,setIsSubmitting] = useState(false);

    const {requestPasswordReset} = useAuth();

    async function handleRquestReset(e){

        e.preventDefault();
        setValidationError(null);
        setRequestError(null);
        setMessage("");
        setIsSubmitting(true);

        const emailToValidate = email.trim();

        try {
            emailSchema.parse({ email: emailToValidate });
        } catch (err) {
            const fieldErrors = zodToFieldErrors(err.issues);
            setValidationError(fieldErrors.email); 
            setIsSubmitting(false);
            return;
        }
        try {
            const res = await requestPasswordReset(emailToValidate); 

            if (!res.ok && res.status !== 404) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || "Failed to process request.");
            }

            setMessage("If an account exists for this email, a password reset link has been sent.");
            setEmail(""); 

        } catch (err) {
            setRequestError(err.message || "An unexpected error occurred."); 
        } finally {
            setIsSubmitting(false);
        }
    }
    
    return(
        <div className="auth-page min-h-[70vh] flex items-center justify-center">
            <div className="auth-card card w-full max-w-md bg-neutral text-neutral-content shadow-xl border border-primary">
            <div className="card-body">
            <h2 className="font-jersey text-3xl text-primary tracking-[0.2em]">
                Reset Password
            </h2>
            <p className="subtitle text-sm text-accent/80 mb-4">
                Enter Your Email To Receive A Password Reset Link.
            </p>
            <form onSubmit={handleRquestReset} className="space-y-4">
                <div className="form-field form-control">
                    <label htmlFor="email"
                       className="label text-sm font-semibold text-accent m-2  block ">
                        E-mail
                    </label>

                    <input id="email"
                        name ="email"
                        placeholder="Enter Your E-mail"
                        type ="email"
                        value ={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input input-bordered text-accent">

                    </input>

                </div>

                {(validationError || requestError) && (
                    <p className="error-message text-sm text-error mt-1">
                        {validationError || requestError}
                    </p>
                )}

                {message && (
                    <p className="success-message text-sm text-success mt-1">
                        {message}
                    </p>
                )}

                <button className="btn btn-primary w-full bg-primary border-primary text-black hover:bg-accent hover:border-accent font-jersey text-xl tracking-[0.15em] mt-4"
                type ="submit"
                disabled ={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send Reset Link"}
                </button>

            </form>

        </div>
      </div>  
    </div>

        
    );
}

