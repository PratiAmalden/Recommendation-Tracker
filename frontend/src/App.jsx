import { useState } from 'react'
import './App.css'

function App() {
  const [formData, setFormData] = useState({
    title : '',
    recommender: '',
    category : '',
    mood:'' 

  })

  const handleChange = (e)=>{
    setFormData({...formData,[e.target.name]:[e.target.value]})
  };

  const handleSubmit = (e) =>{
    e.preventDefault();

    const response = fetch("http://localhost:3000",{
      method: "POST",
      header: {"Content-Type": "application/json"},
      body: JSON.stringify(formData),
    });

    const result = response.json();
    console.log(result);

    alert("Form Submitted!")


  }

  return (
    
    <div className='container'>
      <h3>Add New Recommendation</h3>
      <form onClick={handleSubmit}>
        <label htmlFor='title'>Title</label>
        <input type="text" placeholder='Enter Recommendation Title' name="title" required onChange={handleChange}></input>

        <label htmlFor='recommender'>Recommender</label>
        <input type="text" placeholder='Enter the Recommender Name' name='recommender' required onChange={handleChange}></input>

        <label htmlFor='category'>Category</label>
        <select name ='category' onChange={handleChange}>
          <option value="book">Book</option>
          <option value = "TV">TV</option>
          <option value="new">Add New</option>
        </select>

        <label htmlFor='mood'>Mood</label>
        <select name ='mood' multiple onChange={handleChange}>
          <option value="upbeat">Upbeat</option>
          <option value ="throughtful">Throughtful</option>
          <option value ="newmood">Add New</option>
        </select>

        <button type="submit" >Submit</button>

  

    </form>
 
  </div>
     
    
  )
}

export default App
