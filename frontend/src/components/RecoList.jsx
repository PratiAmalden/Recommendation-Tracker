import { useState } from "react";
import CategorySelector from "./CatgoryDropdown";
import MoodSelector from "./MoodCheckbox";

export default function RecommendationsList({
  rec,
  onEdit,
  moodOptions,
  onDelete,
  categories,
}) {

  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    item_name: rec.item_name,
    category: rec.category,
    recommender: rec.recommender,
    moods: rec.moods ? rec.moods.map((m) => m.id) : [],
  });

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleMoodChange = (e) => {
    const { value, checked } = e.target;
    const id = Number(value);

    setForm((prev) =>
      checked
        ? { ...prev, moods: [...prev.moods, id] }
        : { ...prev, moods: prev.moods.filter((v) => v !== id) }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onEdit(rec.id, form);
    setEditing(false);
  };

  return (
      <div className="card-body p-6 flex flex-col h-full">
        {editing ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 flex-1">
            <input
              className="input input-bordered bg-black/40 border-primary text-base-content"
              value={form.item_name}
              onChange={(e) => updateField("item_name", e.target.value)}
              placeholder="Item name"
            />

            <input
              className="input input-bordered bg-black/40 border-primary text-base-content"
              value={form.recommender}
              onChange={(e) => updateField("recommender", e.target.value)}
              placeholder="Recommender"
            />

            <CategorySelector
              label="Category"
              options={categories}
              name="category"
              value={form.category}
              onChange={(e) => updateField("category", e.target.value)}
            />

            <MoodSelector
              label="Moods"
              name="moods"
              options={moodOptions}
              value={form.moods}
              onChange={handleMoodChange}
            />

            <div className="flex gap-2 justify-center mt-4">
              <button className="btn btn-primary" type="submit">
                Save
              </button>
              <button className="btn"
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setForm({
                      item_name: rec.item_name,
                      category: rec.category,
                      recommender: rec.recommender,
                      moods: rec.moods ? rec.moods.map(m => m.id) : []
                    });
                  }}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="w-full min-h-[4rem] flex items-start mb-2">
              <h2 className="card-title text-primary font-jersey text-3xl line-clamp-2">
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

            <div className="flex justify-center gap-3 mt-4">
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
          </>
        )}
      </div>
  );
}
