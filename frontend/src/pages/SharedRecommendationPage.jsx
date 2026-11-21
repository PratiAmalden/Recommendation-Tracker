import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL || "";

export default function SharedRecommendationPage() {
  const { shareToken } = useParams();
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    
    const fetchSharedRecommendation = async () => {
        try {
            const res = await fetch(`${BASE_URL}/api/shared/recommendations/${shareToken}`);
            const result = await res.json().catch(() => ({}));

            if (!res.ok) throw new Error(result.message || "Recommendation not found.");

            if (active) setRecommendation(result.data);
        } catch (reqError) {
            if (active) setError(reqError.message)
        } finally {
            if (active) setLoading(false);
        }
    }
    
    fetchSharedRecommendation();

    return () => {
      active = false;
    };
  }, [shareToken]);

  if (loading) {
    return <main className="flex min-h-screen items-center justify-center bg-base-100"><span className="loading loading-spinner loading-lg text-primary" /></main>;
  }

  if (error || !recommendation) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-base-100 px-4 text-center">
        <div>
          <p className="text-error">{error || "Recommendation not found"}</p>
          <Link className="btn btn-outline mt-5 border-primary text-accent" to="/">Go home</Link>
        </div>
      </main>
    );
  }

  const imageUrl = recommendation.image_url ? `${BASE_URL}${recommendation.image_url}` : null;
  const isCompleted = recommendation.status === "completed";
  const rating = Number(recommendation.rating);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#1f2937,_#050608_65%)] px-4 py-10 text-base-content">
      <article className="w-full max-w-md rounded-2xl border border-primary/60 bg-neutral/95 p-7 text-center shadow-2xl">
        <p className="font-jersey text-xl tracking-[0.25em] text-accent">Recommendation</p>
        <div className="mt-6 overflow-hidden rounded-lg border border-primary/30 bg-black/20">
          {imageUrl ? <img src={imageUrl} alt={recommendation.item_name} className="h-56 w-full object-cover" /> : <div className="flex h-32 items-center justify-center text-accent/50">No image</div>}
        </div>
        <h1 className="mt-6 font-jersey text-4xl text-primary">{recommendation.item_name}</h1>
        <p className="mt-2 text-lg text-accent">{recommendation.category}</p>
        <p className="mt-6 text-sm uppercase tracking-[0.2em] text-accent">Recommended by</p>
        <p className="mt-1 text-xl">{recommendation.recommender || "Someone special"}</p>

        {recommendation.moods?.length > 0 && (
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {recommendation.moods.map((mood) => <span key={mood} className="rounded-full border border-primary px-3 py-1 text-sm text-accent">{mood}</span>)}
          </div>
        )}

        {isCompleted && (
          <div className="mt-7 border-t border-primary/30 pt-6">
            <p className="text-2xl text-accent" aria-label={rating >= 1 && rating <= 5 ? `${rating} out of 5 stars` : "Not rated"}>
              {rating >= 1 && rating <= 5 ? `${"★".repeat(rating)}${"☆".repeat(5 - rating)}` : "Not rated"}
            </p>
            {recommendation.review && <blockquote className="mt-4 text-lg italic">“{recommendation.review}”</blockquote>}
          </div>
        )}

        <p className="mt-8 text-xs tracking-[0.15em] text-accent/70">Recommended with Recommendation Tracker</p>
      </article>
    </main>
  );
}