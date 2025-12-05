import RecommendationsList from "./RecoList";
import RecommendationFilter from "./FilterDropdown";
import { useRecommendations } from "../hooks/useRecommendations";
import { useNavigate } from "react-router-dom";

export default function RecommendationPage() {
  const {
    user,
    items,
    loading,
    error,
    moodOptions,
    categories,
    editRecommendation,
    deleteRecommendation,
    filters,
    setFilters
  } = useRecommendations();

  const navigate = useNavigate();

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

      <div className="mb-6">
        <RecommendationFilter 
           filters={filters} 
           onFilterChange={setFilters} 
        />
      </div>

      {items.length === 0 && (
        <p className="text-accent/70 text-lg mb-6">
          You have not added any recommendations yet.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
        {items.map((r) => (
          <div
            key={r.id}
            className="card h-full bg-neutral border border-primary shadow-xl flex flex-col"
          >
            <RecommendationsList
              rec={r}
              onEdit={editRecommendation}
              onDelete={deleteRecommendation}
              moodOptions={moodOptions}
              categories={categories}
            />
          </div>
        ))}
      </div>

      <button
        className="btn btn-outline border-primary text-accent hover:bg-primary hover:text-black font-jersey text-xl mt-6"
        onClick={() => navigate("/add-recommendation")}
      >
        Add Recommendation
      </button>
    </div>
  );
}
