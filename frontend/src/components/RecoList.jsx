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
      <div className="card-body flex flex-col items-stretch text-center p-6 gap-3">
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
            <div className="flex-1 flex flex-col items-center gap-2">
              {rec.image_url && (
                <img
                  src={rec.image_url}
                  alt={rec.item_name}
                  className="w-full h-48 object-cover rounded-lg mb-3"
                />
              )}

              <h2 className="card-title text-primary font-jersey text-2xl line-clamp-2">
                {rec.item_name}
              </h2>

              <p className="text-accent text-sm">
                Category: 
                <span className="text-base-content font-medium"> { rec.category  }</span>
              </p>

              <p className="text-accent text-sm">
                Recommended by:
                <span className="text-base-content font-medium">
                  {rec.recommender}
                </span>
              </p>

              {Array.isArray(rec.moods) && rec.moods.length > 0 && (
                <div className="mt-2">
                  <p className="text-accent text-sm mb-2">Moods:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {rec.moods.map((m) => (
                      <span
                        key={m.id}
                        className="px-3 py-1 rounded-full border border-primary bg-black/40 text-base-content text-xs">
                        {m.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-center gap-3 mt-4">
              <button className="btn btn-primary btn-sm font-jersey"
                onClick={() => setEditing(true)}>
                Edit
              </button>
              <button
                className="btn btn-error btn-sm font-jersey"
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
