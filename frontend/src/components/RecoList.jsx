import { useEffect, useState } from "react";
import { useAuth } from "../hooks/AuthContext";
import RecommendationFilter from "./FilterDropdown";

export default function RecommendationsList() {
  const { user, token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters]= useState({
    category:"",
    mood:"",
    recommender:""
  });



  useEffect(() => {
    if (user && token) {
      load();
    } else {
      setItems([]);
      setLoading(false);
    }
  }, [user, token,filters]);

  async function load() {
      try {
        setError(null);
        setLoading(true);

        const queryParams = new URLSearchParams();

        if(filters.category) queryParams.append("category",filters.category);
        if(filters.mood) queryParams.append("mood",filters.mood);
        if(filters.recommender) queryParams.append("recommender", filters.recommender);

        const res = await fetch(
          `http://localhost:3000/api/recommendations?${queryParams.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to load recommendations");
        }

        const data = await res.json();

        const list = Array.isArray(data.data) ? data.data : [];

        setItems(list);
      } catch (err) {
        console.error(err.message)
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <p className="text-accent/80 text-lg">
          You must be logged in to view your recommendations.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <p className="text-error text-lg">{error}</p>
      </div>
    );
  }



  return (
    <div className="min-h-[70vh]">
      <h1 className="font-jersey text-4xl text-primary tracking-[0.15em] mb-6">
        Your Recommendations
      </h1>

      <RecommendationFilter onFilterChange={(newfilters) => setFilters(newfilters)} />

      {items.length === 0 ? (
        <p className="text-accent/70 text-lg">
          You haven't added any recommendations yet.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((rec) => (
            <div
              key={rec.id}
              className="card bg-neutral border border-primary shadow-xl"
            >
              <div className="card-body">
                <h2 className="card-title text-primary font-jersey text-3xl">
                  {rec.item_name}
                </h2>

                <p className="text-accent text-sm">
                  Category:{" "}
                  <span className="text-base-content">
                    {rec.category || "Uncategorized"}
                  </span>
                </p>

                <p className="text-accent text-sm">
                  Recommended by:{" "}
                  <span className="text-base-content">
                    {rec.recommender || "Unknown"}
                  </span>
                </p>

                {Array.isArray(rec.moods) && rec.moods.length > 0 && (
                  <div className="mt-3">
                    <p className="text-accent text-sm mb-1">Moods</p>
                    <div className="flex flex-wrap gap-2">
                      {rec.moods.map((m) => (
                        <span
                          key={m.id}
                          className="badge badge-outline border-primary text-accent"
                        >
                          {m.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="card-actions justify-end mt-4">
                  <button className="btn btn-outline border-primary text-accent hover:bg-primary hover:text-black font-jersey">
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
