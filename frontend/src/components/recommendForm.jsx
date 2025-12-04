import { useState, useEffect} from 'react'
import CategorySelector from './CatgoryDropdown';
import MoodSelector from './MoodCheckbox';
import { useAuth } from '../hooks/AuthContext';

// Get the API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL;

function RecommendationForm() {

  // adding success && error states

  const [message,setMessage] = useState("");
  const [error,setError] = useState("");
// To store the list of moods fetched from the backend
  const[moodOptions, setMoodOptions] = useState([]);

  //adding form states
  const [formData, setFormData] = useState({
    item_name : '',
    recommender: '',
    category : '',
    moods:[]
  });

  const { user,token } = useAuth();
  const categories = ["Movie","Book","TV show","Others"];
  
  // fetch mood list from the db

  useEffect (()=>{
    async function fetchMoods(){
      try {
        const res = await
        fetch(`${API_URL}/api/moods`);
        const data = await res.json();

        if (data.success){
          const formattedMoods = data.data.map(m => ({
            id: m.id,
            label:m.name
          }));
          setMoodOptions(formattedMoods);
        }
      } catch(err){
        console.error("Failed to fetch moods",err);
        setError("Could not load mood options");
      }
    }
    fetchMoods();
  },[]);

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

    //reset messages

    setMessage("");
    setError("");
    
    

    try{
        const response = await fetch(`${API_URL}/api/recommendations`,{
            method: "POST",
            headers: {"Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
              ...formData,
              user_id: user.userId
            }),
          });

          if(!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to add recommendation");
          }
          const result = await response.json();
          console.log(result);
          setMessage("Recommendation added Successfully!");

          setFormData({
            item_name: '',
            recommender:'',
            category:'',
            moods:[]
          });
    }
    catch(err)
    {
        console.log(err);
        setError("Error submitting form. Please Try Again");
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
