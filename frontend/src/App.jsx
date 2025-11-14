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

export default function app() {
  return (
    <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<p>Home page placeholder</p>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to={"/login"} replace />} />
          </Routes>
        </Router>
    </AuthProvider>
  );
}
