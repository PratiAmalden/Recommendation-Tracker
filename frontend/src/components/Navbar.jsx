import { useAuth } from "../hooks/AuthContext";
import { Link } from "react-router-dom";

export default function Navbar(){
    const {user, logOut} = useAuth();

    return (
        <nav>
            <Link to="/">Home</Link>
            
            {user? (
                <>
                <Link to="/profile">Profile</Link>
                <button onClick={logOut}>Log Out</button>
                </>
            ) : ( <>
            <Link to="/login">Log in</Link>
            <Link to="/signup">Sign up</Link>
            </>
            )}
        </nav>
    )
}