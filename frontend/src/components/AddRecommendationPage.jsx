import { useRecommendations } from '../hooks/useRecommendations';
import RecommendationForm from './recommendForm';
import { useNavigate } from 'react-router-dom';

export default function AddRecommendationPage() {
  const {
    user,
    error,
    moodOptions,
    categories,
    addRecommendation
  } = useRecommendations();

  const navigate = useNavigate();

  const handleAddSubmit = async (formData) => {
    try {
        await addRecommendation(formData);
        navigate('/recommendations'); 
    } catch (err) {
        console.error("Failed to add rec:", err);
    }
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <p className="text-accent/80 text-lg">
        You must be logged in to view your recommendations.
        </p>
      </div>
    );
  }


  if (error) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <p className="text-error text-lg">{error}</p>
      </div>
    );
  }

  return (
    <RecommendationForm onSubmit={handleAddSubmit} moodOptions={moodOptions} categories={categories} />
  )
}