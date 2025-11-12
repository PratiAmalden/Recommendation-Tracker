import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    
    <div className='container'>
      <h1>Add New Recommendation</h1>
      <form>
        <label htmlFor='title'>Title</label>
        <input type="text" placeholder='Enter Recommendation Title' name="title" required></input>

        <label htmlFor='recommender'>Recommender</label>
        <input type="text" placeholder='Enter the Recommender Name' name='recommender' required></input>

        <label htmlFor='category'>Category</label>
        <select name ='category'>
          <option value="book">Book</option>
          <option value = "TV">TV</option>
          <option value="new">Add New</option>
        </select>

        <label htmlFor='mood'>Mood</label>
        <select name ='mood'>
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
