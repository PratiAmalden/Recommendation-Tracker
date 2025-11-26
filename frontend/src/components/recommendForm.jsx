import { useState } from 'react'
import CategorySelector from './CatgoryDropdown';
import MoodSelector from './MoodCheckbox';
import { useAuth } from '../hooks/AuthContext';

function RecommendationForm() {

  // adding success && error states

  const [message,setMessage] = useState("");
  const [error,setError] = useState("");

  //adding form states
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

    //reset messages

    setMessage("");
    setError("");
    
    

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
          setMessage("Recommendation added Successfully!");
    }
    catch(err)
    {
        console.log(err);
        setError("Error submitting form. Please Try Again");
    }
  }
  return (
    <div className='container'>
      <h3>Add Recommendation</h3>
      <form onSubmit={handleSubmit}>
        <label htmlFor='item-name'>Item Name</label>
        <input type="text" id="item-name" placeholder='Enter Recommendation Title' name="item_name" required onChange={handleChange} value={formData.item_name}></input>
        <label htmlFor='recommender'>Recommender</label>
        <input type="text" id="recommender" placeholder='Enter the Recommender Name' name='recommender' required onChange={handleChange} value={formData.recommender}></input>
        <CategorySelector
          label ="Category"
          options={categories}
          name = "category"
          value = {formData.category}
          onChange={handleChange} 
        />
        <MoodSelector
        label="Moods"
        name = "moods"
        options={moods}
        value = {formData.moods}
        onChange={handleChange}
        />
        <button type="submit" >Submit</button>

        {message && <p className='success-message'>{message}</p>}
        {error && <p className='error-message'>{error}</p>}
    </form>
  </div>
  )
}
export default RecommendationForm