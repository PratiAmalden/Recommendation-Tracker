import { useAuth } from "../hooks/AuthContext";

export default function Profile() {
  const { user, logOut } = useAuth();
  if (!user) return <p className="page-content">Not signed in</p>;

  return (
    <div className="page-content">
      <h1>Profile</h1>
      <p>
        Signed in as <strong>{user.username}</strong>
      </p>
      <button onClick={logOut}>Log out</button>
    </div>
  );
}
