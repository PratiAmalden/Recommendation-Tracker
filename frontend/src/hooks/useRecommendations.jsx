import { useState, useEffect } from "react";
import { useAuth } from "../hooks/AuthContext";

const API = "http://localhost:3000/api";

export function useRecommendations() {
  const { user, token } = useAuth();

  const [items, setItems] = useState([]);
  const [moodOptions, setMoodOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = ["Movie", "Book", "TV show", "Others"];

  useEffect(() => {
    if (user && token) {
      loadRecommendations();
    } else {
      setItems([]);
      setLoading(false);
    }
  }, [user, token]);

  useEffect(() => {
    fetchMoods();
  }, []);

  async function fetchMoods() {
    try {
      const res = await fetch(`${API}/moods`);
      const data = await res.json();

      if (data.success) {
        const formatted = data.data.map((m) => ({
          id: m.id,
          label: m.name,
        }));
        setMoodOptions(formatted);
      }
    } catch (err) {
      console.error("Failed to fetch moods", err);
      setError("Could not load mood options");
    }
  }

  async function loadRecommendations() {
    try {
      setError(null);
      setLoading(true);

      const res = await fetch(`${API}/recommendations`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Failed to load recommendations");
      }

      const data = await res.json();
      setItems(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      console.error(err.message);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function addRecommendation(newRec) {
    setError(null);

    try {
      const res = await fetch(`${API}/recommendations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ ...newRec, user_id: user.userId }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to add recommendation");
      }

      const result = await res.json();
      const created = result.data || result;

      setItems((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      console.error(err.message);
      setError(err.message || "Something went wrong");
      throw err;
    }
  }

  async function editRecommendation(id, newData) {
    const res = await fetch(`${API}/recommendations/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(newData),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to update recommendation");
    }

    const result = await res.json();

    setItems(prev =>
        prev.map((r) =>
          r.id === id ? result : r 
        )
        );
  }

  async function deleteRecommendation(id) {
    setItems((prev) => prev.filter((r) => r.id !== id));

    try {
      await fetch(`${API}/recommendations/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Failed to delete recommendation", err);
    }
  }

  return {
    user,
    items,
    loading,
    error,
    moodOptions,
    categories,
    addRecommendation,
    editRecommendation,
    deleteRecommendation,
    reload: loadRecommendations,
  };
}
