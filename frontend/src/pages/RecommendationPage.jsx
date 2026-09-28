import RecommendationCard from "../components/ui/RecommendationCard";
import RecommendationFilter from "../components/ui/FilterDropdown";
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
    completeRecommendation,
    createShareLink,
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

  // Filter items into active and completed lists
  const activeItems = items.filter((r) => r.status == "pending");
  const completedItems = items.filter((r) => r.status === "completed");

  return (
    <div className="min-h-[70vh]">
      <h1 className="font-jersey text-4xl text-primary tracking-[0.15em] mb-6">
        Your Recommendations
      </h1>

      <div className="mb-6">
        <RecommendationFilter 
           filters={filters} 
           onFilterChange={setFilters} 
           moodOptions={moodOptions}
        />
      </div>

      {items.length === 0 && (
        <p className="text-accent/70 text-lg mb-6">
          You have not added any recommendations yet.
        </p>
      )}

      {/* Active Recommendations Grid */}
      {activeItems.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
          {activeItems.map((r) => (
            <div
              key={r.id}
              className="card h-full bg-neutral border border-primary shadow-xl flex flex-col"
            >
              <RecommendationCard
                rec={r}
                onEdit={editRecommendation}
                onComplete={completeRecommendation}
                onCreateShare={createShareLink}
                onDelete={deleteRecommendation}
                moodOptions={moodOptions}
                categories={categories}
              />
            </div>
          ))}
        </div>
      )}

      {/* Completed Recommendations Section */}
      {completedItems.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="font-jersey text-3xl text-accent tracking-[0.15em]">
              Completed
            </h2>
            <div className="flex-1 border-b border-primary/30" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch opacity-85">
            {completedItems.map((r) => (
              <div
                key={r.id}
                className="card h-full bg-neutral border border-primary/50 shadow-xl flex flex-col"
              >
                <RecommendationCard
                  rec={r}
                  onEdit={editRecommendation}
                  onComplete={completeRecommendation}
                  onCreateShare={createShareLink}
                  onDelete={deleteRecommendation}
                  moodOptions={moodOptions}
                  categories={categories}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        className="btn btn-outline border-primary text-accent hover:bg-primary hover:text-black font-jersey text-xl mt-6"
        onClick={() => navigate("/add-recommendation")}
      >
        Add Recommendation
      </button>
    </div>
  );
}
