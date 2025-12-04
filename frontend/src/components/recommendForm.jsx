import { useState } from 'react'
import CategorySelector from './CatgoryDropdown';
import MoodSelector from './MoodCheckbox';

function RecommendationForm({ onSubmit, moodOptions, categories }) {

  //adding form states
  const [formData, setFormData] = useState({
    item_name : '',
    recommender: '',
    category : '',
    moods:[]
  });
  
  const handleChange = (e) => {
  const { type, name, value, checked } = e.target;

  if (type === "checkbox") {
    const id = Number(value);
    setFormData(prev =>
      checked
        ? { ...prev, moods: [...prev.moods, id] }
        : { ...prev, moods: prev.moods.filter(v => v !== id) }
    );
  } else {
    setFormData(prev => ({ ...prev, [name]: value }));
  }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      item_name: '',
      recommender: '',
      category: '',
      moods: []
    });
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="card w-full max-w-2xl bg-neutral text-neutral-content shadow-2xl border border-primary">
        <div className="card-body">
          <h3 className="font-jersey text-3xl text-primary mb-4 tracking-[0.25em]">
            Add Recommendation
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label
                htmlFor="item-name"
                className="label text-sm font-semibold text-accent m-3"
              >
                Item Name
              </label>
              <input
                type="text"
                id="item-name"
                placeholder="Enter recommendation title"
                name="item_name"
                required
                onChange={handleChange}
                value={formData.item_name}
                className="input input-bordered bg-black/40 text-base-content border-primary focus:outline-none"
              />
            </div>

            <div className="form-control">
              <label
                htmlFor="recommender"
                className="label text-sm font-semibold text-accent m-3"
              >
                Recommender
              </label>
              <input
                type="text"
                id="recommender"
                placeholder="Enter the recommender name"
                name="recommender"
                required
                onChange={handleChange}
                value={formData.recommender}
                className="input input-bordered bg-black/40 text-base-content border-primary focus:outline-none"
              />
            </div>

            <CategorySelector
              label="Category"
              options={categories}
              name="category"
              value={formData.category}
              onChange={handleChange}
            />

            <MoodSelector
              label="Moods"
              name="moods"
              options={moodOptions}
              value={formData.moods}
              onChange={handleChange}
            />

            <div className="form-control mt-6">
              <button
                type="submit"
                className="btn btn-primary font-jersey text-xl tracking-[0.15em]"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RecommendationForm;
