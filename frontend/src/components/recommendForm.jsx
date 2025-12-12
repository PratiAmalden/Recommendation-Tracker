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
  const [ image, setImage ] = useState(null);
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
    } else if(type === "file"){
      const file = e.target.files[0] || null

      if(file){
        const maxSize = 100 * 1024;
        if(file.size > maxSize){
          setError(prev => ({...prev, recoImg: "Image must be under 100KB"}));
          setImage(null);
          return;
        } 
      }
      setImage(file);
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
    
    onSubmit(formData, image);
    
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
                name="item_name"
                placeholder="Enter recommendation title"
                onChange={handleChange}
                value={formData.item_name}
                className={`input input-bordered bg-black/40 text-base-content focus:outline-none ${error.item_name ? "input-error border-error" : "border-primary"}`}
              />
              {error.item_name && <p className="text-xs text-error mt-1 ml-3">{error.item_name}</p>}
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
                name="recommender"
                placeholder="Enter the recommender name"
                onChange={handleChange}
                value={formData.recommender}
                className={`input input-bordered bg-black/40 text-base-content focus:outline-none ${error.recommender ? "input-error border-error" : "border-primary"}`}
              />
               {error.recommender && <p className="text-xs text-error mt-1 ml-3">{error.recommender}</p>}
            </div>

            <div>
              <CategorySelector
                label="Category"
                options={categories}
                name="category"
                value={formData.category}
                onChange={handleChange}
              />
              {error.category && <p className="text-xs text-error mt-1 ml-3">{error.category}</p>}
            </div>

            <div>
              <MoodSelector
                label="Moods"
                name="moods"
                options={moodOptions}
                value={formData.moods}
                onChange={handleChange}
              />
              {error.moods && <p className="text-xs text-error mt-1 ml-3">{error.moods}</p>}
            </div>

            <div>
              <label 
                htmlFor="recommender" 
                className="label text-sm font-semibold text-accent m-3"
              >
                Add cover image
              </label>       
              <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleChange}
              name="recoImg"
              />
              {error.recoImg && (
                <p className="text-xs text-error mt-1 ml-3">{error.recoImg}</p>
              )}
            </div>

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
