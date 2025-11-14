import { useAuth } from "../hooks/AuthContext";

export default function Profile() {
  const { user, logOut } = useAuth();
  if (!user) return <p>Not sign in</p>;
  return (
    <div>
      <p>
        Signed in as <strong>{user?.username}</strong>
      </p>
      <button onClick={logOut}>Log out</button>
    </div>
  );
}
