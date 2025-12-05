import { useAuth } from "../hooks/AuthContext";
import { Link } from "react-router-dom";

export default function Navbar(){
    const {user, logOut} = useAuth();

    return (
      <nav className="navbar sticky top-0 z-50 bg-black/80 backdrop-blur border-b border-primary">
        <div className="flex-1">
          <Link
            to="/"
            className="btn btn-ghost font-jersey text-xl text-primary tracking-[0.15em]"
          >
            Recommendation Tracker
          </Link>
        </div>
        <div className="flex-none gap-2">
          {user ? (
            <div className="flex items-center gap-6">
              <Link
                to="/profile"
                className="btn btn-ghost font-jersey text-xl text-accent"
              >
                Profile
              </Link>
              <Link
                to="/add-recommendation"
                className="btn btn-outline border-primary text-accent hover:bg-primary hover:text-black font-jersey text-xl"
              >
                Add Recommendation
              </Link>
              <Link
                to="/recommendations"
                className="btn btn-ghost font-jersey text-xl text-accent"
              >
                My List
              </Link>
              <button
                onClick={logOut}
                className="btn btn-error font-jersey text-xl"
              >
                Log out
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="btn btn-ghost font-jersey text-xl text-accent"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="btn btn-outline border-primary text-accent hover:bg-primary hover:text-black font-jersey text-xl"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    );
}