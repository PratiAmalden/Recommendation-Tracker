import { useRecommendations } from '../hooks/useRecommendations';
import RecommendationForm from './recommendForm';

export default function AddRecommendationPage() {
  const {
    user,
    error,
    moodOptions,
    categories,
    addRecommendation
  } = useRecommendations();


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
    <RecommendationForm onSubmit={addRecommendation} moodOptions={moodOptions} categories={categories} />
  )
}