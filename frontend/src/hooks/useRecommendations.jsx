import { useState, useEffect } from "react";
import { useAuth } from "../hooks/AuthContext";
import {useLocation} from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL;
const API = `${BASE_URL}/api`;

export function useRecommendations() {
  const { user, token } = useAuth();
 
 const location = useLocation();
  const [items, setItems] = useState([]);
  const [moodOptions, setMoodOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters,setFilters] = useState({
    category:"",
    mood:"",
    recommender:""
  });

  const categories = ["Movie", "Book", "TV show", "Others"];

  useEffect(()=> {
    setFilters({
      category:"",
      mood:"",
      recommender:""
    });
  },[location.key]);

  useEffect(()=>{
    if(user && token){
      loadRecommendations();
    }
    else{
      setItems([]);
      setLoading(false);
    }
  },[user,token,filters]);



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

      const queryParams = new URLSearchParams();

      if (filters.category) queryParams.append("category", filters.category);
      if (filters.mood) queryParams.append("mood", filters.mood);
      if (filters.recommender) queryParams.append("recommender", filters.recommender);

      const res = await fetch(`${API}/recommendations?${queryParams.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Failed to load recommendations");
      }

      const data = await res.json();
      const rows = Array.isArray(data.data) ? data.data : []

      const normalized = rows.map((r) => ({
      ...r,
      image_url: r.image_url ? `${BASE_URL}${r.image_url}` : null,
      }));
      setItems(normalized);
    } catch (err) {
      console.error(err.message);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function addRecommendation(recoData, imageFile) {
    setError(null);

    try {
      const res = await fetch(`${API}/recommendations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ ...recoData, user_id: user.userId }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to add recommendation");
      }

      const result = await res.json();
      const created = result.data || result;

      if(imageFile){
        const imgFormData = new FormData();
        imgFormData.append("recoImg", imageFile);
    
        const imgRes = await fetch(`${API}/recommendations/${created.id}/image`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
          body: imgFormData,
        });

        if(!imgRes) throw new Error("Failed to uplaod the image");

        const imgData = await imgRes.json();
        const url = imgData.image?.url || imgData.image?.file_path;

        if(url) {
          created.image_url = url;
        }
      }

      setItems((prev) => [created, ...prev]);
      console.log(items)
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
    filters,
    setFilters
  };
}
