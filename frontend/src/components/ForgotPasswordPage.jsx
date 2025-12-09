import { useState } from "react";
import {useAuth} from "../hooks/AuthContext";

export default function ForgotPasswordPage(){

    const [email,setEmail]= useState("");
    const [message,setMessage] = useState("");
    const [error, setError] = useState(null);
    const [isSubmitting,setIsSubmitting] = useState(false);

    const {requestPasswordReset} = useAuth();

    async function handleRquestReset(e){

        e.preventDefault();
        setError(null);
        setMessage("");
        setIsSubmitting(true);

        const emailToValiate = email.trim();

    }

    return(
        <div className="auth-page min-h-[70vh] flex items-center justify-center">
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
                        onChange={(e) => setEmail(e.target.value)}>

                    </input>

                </div>

                {/* put error in here from zod */}

                <button className="btn btn-primary w-full bg-primary border-primary text-black hover:bg-accent hover:border-accent font-jersey text-xl tracking-[0.15em] mt-4"
                type ="submit"
                disabled ={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send Reset Link"}
                </button>

            </form>

        </div>
        
    )
}

