import { useAuth } from "../hooks/AuthContext";
import { Link, NavLink } from "react-router-dom";

export default function Navbar(){
    const {user, logOut} = useAuth();

    const getLinkClass = ({ isActive }) => 
      isActive 
          ? "btn btn-outline border-primary text-primary hover:bg-primary hover:text-black font-jersey text-xl" 
          : "btn btn-ghost font-jersey text-2xl text-accent hover:text-primary";

    return (
      <nav className="navbar sticky top-0 z-50 bg-black/80 backdrop-blur border-b border-primary">
        <div className="flex-1">
          <Link
            to="/"
            className="btn btn-ghost font-jersey text-2xl text-primary tracking-[0.15em]"
          >
            Recommendation Tracker
          </Link>
        </div>
        <div className="flex-none gap-2">
          {user ? (
            <div className="flex items-center gap-4">
              <NavLink to="/profile" className={getLinkClass}>
                Profile
              </NavLink>

              <NavLink to="/add-recommendation" className={getLinkClass}>
                Add Recommendation
              </NavLink>

              <NavLink to="/recommendations" className={getLinkClass}>
                My List
              </NavLink>

              <button
                onClick={logOut}
                className="btn btn-error font-jersey text-xl ml-2"
              >
                Log out
              </button>
            </div>
          ) : (
            <>
              <NavLink to="/login" className={getLinkClass}>
                Log in
              </NavLink>

              <NavLink to="/signup" className={getLinkClass}>
                Sign up
              </NavLink>
            </>
          )}
        </div>
      </nav>
    );
}