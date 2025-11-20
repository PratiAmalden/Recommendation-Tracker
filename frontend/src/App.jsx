import { useState } from 'react'
import './App.css'
import RecommendationForm from './components/recommendForm';
import ListCard from './components/ListUI';

const items = [
  {
    title: "The Office",
    category: "Comedy",
    mood: ["Funny", "Light"],
    recommender: "John",
  },
  {
    title: "Breaking Bad",
    category: "Drama",
    mood: ["Serious", "Thrilling"],
    recommender: "Alex",
  },
];


function App() {
  return(
    <>
    <section >
      <ListCard items ={items}></ListCard>
    </section>
    <section>
      <RecommendationForm />
    </section>
    </>
  )
}

export default App
