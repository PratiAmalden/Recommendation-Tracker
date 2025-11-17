import { useState } from 'react'
import CategorySelector from './CatgoryDropdown';
import MoodSelector from './MoodCheckbox';

function RecommendationForm() {
  const [formData, setFormData] = useState({
    title : '',
    recommender: '',
    category : '',
    mood:'' 

  })

  const categories = ["Movie","Book","TV show","Others"];
  const moods = ["Inspiring","Thoughtful","Funny","Thrilling"]


  const handleChange = (e)=>{
    const type = e.target.type;
    const name = e.target.name;
    const value = e.target.value;
    const checked = e.target.checked;

    if(type ==="checkbox")
    {
        setFormData((pre) =>{
          return checked
          ? {...pre,[name]: [...pre[name],value]}
          : {...pre,[name]: pre[name].filter((v) => v !== value)};
        })
    }
    else{
    
    setFormData({...formData,[e.target.name]:e.target.value});
    }
  
    
  };

  const handleSubmit = (e) =>{
    e.preventDefault();

    const response = fetch("http://localhost:3000",{
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(formData),
    });

    const result = response.json();
    console.log(result);

    alert("Form Submitted!")


  }

  return (
    
    <div className='container'>
      <h3>Add New Recommendation</h3>
      <form onSubmit={handleSubmit}>
        <label htmlFor='title'>Title</label>
        <input type="text" placeholder='Enter Recommendation Title' name="title" required onChange={handleChange}></input>

        <label htmlFor='recommender'>Recommender</label>
        <input type="text" placeholder='Enter the Recommender Name' name='recommender' required onChange={handleChange}></input>

        <CategorySelector
          label ="Category"
          options={categories}
          name = "category"
          value = {formData.category}
          onChange={handleChange} 
        />

        <MoodSelector
        label="Moods"
        name = "mood"
        options={moods}
        value = {formData.mood}
        onChange={handleChange}
        
        />
        

        <button type="submit" >Submit</button>

  

    </form>
 
  </div>
     
    
  )
}

export default RecommendationForm