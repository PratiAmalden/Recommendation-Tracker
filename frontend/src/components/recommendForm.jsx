import { useState } from 'react'
import CategorySelector from './CatgoryDropdown';
import MoodSelector from './MoodCheckbox';
import { recommendationSchema, zodToFieldErrors } from '../utils/validationSchemas'; 

function RecommendationForm({ onSubmit, moodOptions, categories }) {

  //adding form states
  const [formData, setFormData] = useState({
    item_name : '',
    recommender: '',
    category : '',
    moods:[]
  });

  const [error, setError] = useState({});

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

    if (error[name]) {
      setError(prev => ({ ...prev, [name]: null }));
    }

    if(type === "checkbox" && error.moods) {
      setError(prev => ({ ...prev, moods: null }));
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    setError({});

    const validationResult = recommendationSchema.safeParse(formData);

    if (!validationResult.success) {
      setError(zodToFieldErrors(validationResult.error.issues));
      return;
    }
    
    onSubmit(formData);
    
    setFormData({
      item_name: '',
      recommender: '',
      category: '',
      moods: []
    });
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="card w-full max-w-2xl bg-neutral text-neutral-content shadow-2xl border border-primary">
        <div className="card-body">
          <h3 className="font-jersey text-3xl text-primary mb-4 tracking-[0.25em]">
            Add Recommendation
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="form-control">
              <label 
                htmlFor="item-name" 
                className="label text-sm font-semibold text-accent mb-1"
              >
                Item Name
              </label>
              <input
                type="text"
                id="item-name"
                name="item_name"
                placeholder="Enter recommendation title"
                onChange={handleChange}
                value={formData.item_name}
                className={`input input-bordered w-full bg-black/40 text-base-content focus:outline-none ${error.item_name ? "input-error border-error" : "border-primary"}`}
              />
              {error.item_name && <p className="text-xs text-error mt-1 ml-3">{error.item_name}</p>}
            </div>

            <div className="form-control">
              <label 
                htmlFor="recommender" 
                className="label text-sm font-semibold text-accent mb-1"
              >
                Recommender
              </label>
              <input
                type="text"
                id="recommender"
                name="recommender"
                placeholder="Who recommended this?"
                onChange={handleChange}
                value={formData.recommender}
                className={`input input-bordered w-full bg-black/40 text-base-content focus:outline-none ${error.recommender ? "input-error border-error" : "border-primary"}`}
              />
              {error.recommender && <p className="text-xs text-error mt-1">{error.recommender}</p>}
            </div>

            <div>
              <CategorySelector
                label="Category"
                options={categories}
                name="category"
                value={formData.category}
                onChange={handleChange}
              />
              {error.category && <p className="text-xs text-error mt-1 ml-1">{error.category}</p>}
            </div>

            <div>
                <MoodSelector
                  label="Moods"
                  name="moods"
                  options={moodOptions}
                  value={formData.moods}
                  onChange={handleChange}
                />
                {error.moods && <p className="text-xs text-error mt-1 ml-1">{error.moods}</p>}
            </div>
            
            <div className="form-control mt-8">
              <button
                type="submit"
                className="btn btn-primary w-full font-jersey text-xl tracking-[0.15em] hover:scale-[1.02] transition-transform"
              >
                ADD TO LIST
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RecommendationForm;
