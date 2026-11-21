import { useState, useEffect } from "react";
import CategorySelector from "../ui/CategoryDropdown";
import MoodSelector from "../ui/MoodCheckbox";

export default function EditForm({ onCancel, onSubmit, recommendation, moodOptions, categories }) {
  // const [editing, setEditing] = useState(false);
  const [image, setImage] = useState(null)
  const [imgPreview, setImgPreview] = useState(recommendation.image_url || null);
  const [form, setForm] = useState({
      item_name: recommendation.item_name,
      category: recommendation.category,
      recommender: recommendation.recommender,
      moods: recommendation.moods ? recommendation.moods.map((m) => m.id) : [],
  });


  useEffect(() => {
  setImgPreview(recommendation.image_url || null);
  }, [recommendation.image_url]);

  const updateField = (field, value) => {
  setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateImg = (e) => { 
      const file = e.target.files[0] || null;
      if(file){
      const maxSize = 100 * 1024;
          if(file.size > maxSize){
          setImage(null);
          return;
          }
      }
      setImage(file);
      setImgPreview(URL.createObjectURL(file));
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
      onSubmit(recommendation.id, form, image);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 flex-1">
          <input
            type="file"
            accept="image/png, image/jpeg"
            className="input input-bordered bg-black/40 border-primary text-base-content"
            onChange={updateImg}
            name="recoImg"
          />
          {imgPreview && (
            <img src={imgPreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
          )}
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
                  if (onCancel) onCancel();
                  setForm({
                    item_name: recommendation.item_name,
                    category: recommendation.category,
                    recommender: recommendation.recommender,
                    moods: recommendation.moods ? recommendation.moods.map(m => m.id) : []
                  });
                }}>
              Cancel
            </button>
          </div>
        </form>
);
}