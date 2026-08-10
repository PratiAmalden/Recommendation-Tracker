import { useAuth } from "../hooks/AuthContext";

export default function Profile() {
  const { user, logOut } = useAuth();

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-lg text-accent/80">
          You are not signed in yet.
        </p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="card w-full max-w-md bg-neutral text-neutral-content shadow-xl border border-primary">
        <div className="card-body">
          <h1 className="card-title font-jersey text-3xl text-primary">
            Profile
          </h1>
          <p className="text-base text-base-content mt-2">
            Signed in as{" "}
            <strong className="text-accent">{user.username}</strong>
          </p>
          <div className="card-actions justify-end mt-6">
            <button
              onClick={logOut}
              className="btn btn-outline border-primary text-accent hover:bg-primary hover:text-black font-jersey text-xl"
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
