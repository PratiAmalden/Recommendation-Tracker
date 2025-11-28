import { useState } from 'react'
import CategorySelector from './CatgoryDropdown';
import MoodSelector from './MoodCheckbox';
import { useAuth } from '../hooks/AuthContext';

function RecommendationForm() {
  const [formData, setFormData] = useState({
    item_name : '',
    recommender: '',
    category : '',
    moods:[]
  });

  const { user } = useAuth();
  const categories = ["Movie","Book","TV show","Others"];
  const moods = [{id:1,label:"Happy"},{id:2,label:"Sad"},{id:3,label:"Excited"},{id:4,label:"Calm"}];
  const handleChange = (e)=>{
    const type = e.target.type;
    //const name = e.target.name;
    const value = e.target.value;
    const checked = e.target.checked;
    if(type ==="checkbox")
    {
      const id = Number(value);
        setFormData((pre) =>{
          return checked
          ? {...pre,moods: [...pre.moods,id]}
          : {...pre,moods: pre.moods.filter((v) => v !== id)};
        })
    }
    else{
    setFormData({...formData,[e.target.name]:e.target.value});
    }
  };
  const handleSubmit = async (e) =>{
    e.preventDefault();
    

    try{
        const response = await fetch("http://localhost:3000/api/recommendations",{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
              ...formData,
              user_id: user.userId
            }),
          });
          const result = await response.json();
          console.log(result);
          alert("Form Submitted!")
    }
    catch(err)
    {
        console.log(err);
        alert("Error Submitting Form");
    }
  }
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
              options={moods}
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
