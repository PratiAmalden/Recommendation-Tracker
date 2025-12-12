import { AuthProvider } from "./hooks/AuthContext";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import Profile from "./components/profile";
import Navbar from "./components/Navbar";
import RecommendationPage from './components/RecomendationPage'; 
import AddRecommendationPage from './components/AddRecommendationPage';
import ForgotPasswordPage from "./components/ForgotPasswordPage";

function HomePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-base-100 bg-gradient-to-b from-black via-neutral to-black px-4">
      <div className="text-center">
        <h1 className="font-jersey text-[4.5rem] md:text-[6rem] lg:text-[8rem] text-primary">
          Recommendation Tracker
        </h1>
        <p className="mt-6 max-w-xl mx-auto text-accent text-lg">
          Keep all your movies, books and show recommendations in one
          place. Add, track and revisit them whenever the mood is right.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-base-100 text-base-content">
          <Navbar />
          <div className="app-container max-w-5xl mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route
                path="/add-recommendation"
                element={<AddRecommendationPage />}
              />
              <Route path="/recommendations" element={<RecommendationPage />} />
              <Route path="*" element={<Navigate to={"/login"} replace />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}
