import { useState } from 'react'
import CategorySelector from './CatgoryDropdown';
import MoodSelector from './MoodCheckbox';
import '../App.css';

function RecommendationForm() {
  const [formData, setFormData] = useState({
    item_name : '',
    recommender: '',
    category : '',
    mood:[] 

  });

  const categories = ["Movie","Book","TV show","Others"];
  const moods = [{id:1,label:"Inspiring"},{id:2,label:"Thoughtful"},{id:3,label:"Funny"},{id:4,label:"Thrilling"}];


  const handleChange = (e)=>{
    const type = e.target.type;
    const name = e.target.name;
    const value = e.target.value;
    const checked = e.target.checked;

    if(type ==="checkbox")
    {
      const id = Number(value);
        setFormData((pre) =>{
          
          return checked
          ? {...pre,mood: [...pre[name],id]}
          : {...pre,mood: pre[name].filter((v) => v !== id)};

  
        })
    }
    else{
    
    setFormData({...formData,[e.target.name]:e.target.value});
    }
  
    
  };

  const handleSubmit = async (e) =>{
    e.preventDefault();


    try{
        const response = await fetch("http://localhost:3000",{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(formData),
          });
      
          const result = await response.json();
          console.log(result);

          if(response.ok)
          {
      
          alert("Recommendation Submitted!")

          // reset from after successful submission

          setFormData(
            {item_name:"",
             recommender:"",
             category:"",
             moods:[]
            }
          );
        }
        else{
          alert(`Error.${result.message} || "Fail to add recommendation."}`);
        }

    }
    catch(err)
    {
        console.log(err);
        alert("Error Submitting Form");
    }

  }

  return (
    
    <div className='container'>
      <h3>Add Recommendation</h3>
      <form onSubmit={handleSubmit}>
        <label htmlFor='item-name'>Item Name</label>
        <input type="text" id="item-name" placeholder='Enter Recommendation Title' name="title" required onChange={handleChange}></input>

        <label htmlFor='recommender'>Recommender</label>
        <input type="text" id="recommender" placeholder='Enter the Recommender Name' name='recommender' required onChange={handleChange}></input>

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