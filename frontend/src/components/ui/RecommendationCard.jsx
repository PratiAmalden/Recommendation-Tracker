import { useState } from "react";
import CompletionForm from "../forms/completionForm";
import EditForm from "../forms/EditRecommendationForm";
import ShareRecommendation from "./ShareRecommendation";

export default function RecommendationCard({
  rec,
  onEdit,
  moodOptions,
  onDelete,
  onComplete,
  onCreateShare,
  categories,
}) {

  const [editing, setEditing] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [sharing, setSharing] = useState(false);

  
  return (
      <div className="card-body p-6 flex flex-col h-full">
        {editing ? (
          <EditForm
            recommendation={rec}
            moodOptions={moodOptions}
            categories={categories}
            onSubmit={(id, form, image) => {
              onEdit(id, form, image);
              setEditing(false);
            }}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <>
            <div className="flex justify-end">
              <button
                type="button"
                aria-label={`Share ${rec.item_name}`}
                title="Share recommendation"
                className="btn btn-ghost btn-sm text-accent hover:text-primary"
                onClick={() => setSharing(true)}
              >
               <i class="bi bi-share-fill"></i>
              </button>
            </div>
            <div className="flex flex-col items-center w-full mb-2">
              <div className="w-full h-48 mb-3 overflow-hidden rounded-lg bg-black/20 border border-primary/20 flex items-center justify-center">
                {rec.image_url ? (
                    <img
                      src={rec.image_url}
                      alt={rec.item_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-accent/50">
                      <span className="text-4xl mb-1">🦉</span> 
                      <span className="text-xs font-jersey tracking-widest opacity-70">NO IMAGE</span>  
                    </div>
                )}
              </div>

              <h2 className="card-title text-primary font-jersey text-3xl line-clamp-2 text-center">
                {rec.item_name}
              </h2>
            </div>
            
            <div className="flex flex-col gap-3 w-full">
              <div className="flex flex-col items-start">
                <p className="text-accent text-base">
                  Category: 
                  <span className="text-base-content font-medium"> { rec.category  }</span>
                </p>
              </div>

              <div className="flex flex-col items-start">
                <p className="text-accent text-base">
                  Recommended by: 
                  <span className="text-base-content font-medium ml-1">
                    {rec.recommender}
                  </span>
                </p>
              </div>
            </div>
         

            <div className="mt-4 w-full flex-1">
              <p className="text-accent text-base mb-2">Moods:</p>
              {Array.isArray(rec.moods) && rec.moods.length > 0 && (
                  <div className="flex flex-wrap justify-start gap-2">
                    {rec.moods.map((m) => (
                      <span
                        key={m.id}
                        className="px-3 py-1 rounded-full border border-primary bg-black/40 text-base-content text-sm">
                        {m.name}
                      </span>
                    ))}
                  </div>
                )}
            </div>

            {rec.status === "completed" && (
              <div className="mt-4 border-t border-primary/30 pt-3 text-sm text-accent">
                <div>
                  <p>
                    Completed
                    {Number(rec.rating) >= 1 && Number(rec.rating) <= 5
                      ? ` · ${"★".repeat(Number(rec.rating))}${"☆".repeat(5 - Number(rec.rating))}`
                      : " · Not rated"}
                  </p>
                  {rec.review && <p className="mt-1 text-base-content">{rec.review}</p>}
                </div>
                <button
                  type="button"
                  className="btn btn-xs btn-ghost text-accent hover:text-primary"
                  onClick={() => setCompleting(true)}
                >
                  Edit Rating
                </button>
              </div>
            )}

            <div className="flex justify-center gap-3 mt-4">
              {rec.status !== "completed" && (
                <button
                  className="btn btn-secondary flex-1 text-sm"
                  onClick={() => setCompleting(true)}
                >
                  Complete
                </button>
              )}
              <button className="btn btn-primary flex-1 font-jersey text-xl tracking-wider"
                onClick={() => setEditing(true)}>
                Edit
              </button>
              <button
                className="btn btn-error flex-1 font-jersey text-xl tracking-wider"
                onClick={() => onDelete(rec.id)}
              >
                Delete
              </button>
            </div>
            {completing && (
              <CompletionForm
                itemName={rec.item_name}
                initialRating={rec.rating || null}
                initialReview={rec.review || ""}
                onClose={() => setCompleting(false)}
                onComplete={(completionData) => onComplete(rec.id, completionData)}
              />
            )}
            {sharing && (
              <ShareRecommendation
                itemName={rec.item_name}
                onCreateShare={() => onCreateShare(rec.id)}
                onClose={() => setSharing(false)}
              />
            )}
          </>
        )}
      </div>
  );
}
