import { useEffect, useState } from "react";
import { useAuth } from "../hooks/AuthContext";
import ListCard from "./ListUI";
import { Link } from "react-router-dom";

export default function Home() {
  // Access user info and authentication token from our custom hook
  const { user, token } = useAuth();

  // State to store the list of recommendations fetched from the backend
  const [recommendations, setRecommendations] = useState([]);
  
  // State to handle loading status
  const [loading, setLoading] = useState(true);
  
  // State to handle potential errors
  const [error, setError] = useState(null);

  // useEffect runs when the component mounts or when 'user'/'token' changes
  useEffect(() => {
    async function fetchRecommendations() {
      // If there is no logged-in user, do not fetch data
      if (!user) return;

      try {
        const response = await fetch("http://localhost:3000/api/recommendations", {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });

        const result = await response.json();

        if (result.success) {
          setRecommendations(result.data);
        } else {
          setError(result.message || "Failed to fetch data");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("An error occurred while loading recommendations.");
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, [user, token]); // Dependency array: re-run if user or token changes

  if (loading) return <p className="page-content">Loading recommendations...</p>;

  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Welcome, {user?.username}!</h1>
        <Link to="/recommendationsForm" className="add-button">
           + Add New Recommendation
        </Link>
      </div>
      <ListCard items={recommendations} />
    </div>
  );
}