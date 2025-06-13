// ROUTING
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
// NAVBAR
import MyNavbar from "./components/MyNavbar";
// PAGES
import LoginPage from "./pages/LoginPage";
import LandingPage from "./pages/LandingPage";
import ProfilePage from "./pages/ProfilePage";
import CoursesPage from "./pages/CoursesPage";
import SchedulePage from "./pages/SchedulePage";
import DashboardPage from "./dashboard/DashboardPage";
import NewsPage from "./pages/NewsPage"; // Added NewsPage import
import ContactPage from "./pages/ContactPage"; // Added ContactPage import
// PASSWORD MANAGEMENT
import ForgotPasswordForm from "./forms/ForgotPasswordForm";
import ResetPasswordForm from "./forms/ResetPasswordForm";
import RegisterForm from "./forms/RegisterForm";
// EMAIL CONFIRMATION
import EmailConfirmationPage from "./pages/EmailConfirmationPage";
// COURSE REGISTRATION
import CourseRegistrationPage from "./pages/CourseRegistrationPage";
// STYLE IMPORTS
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// CONTEXTS
import { AuthProvider } from "./contexts/AuthContext";
import { ProfileProvider } from "./contexts/ProfileContext";
import { ApiProvider } from "./contexts/ApiContext";

function App() {
  return (
    <ApiProvider>
      <AuthProvider>
        <ProfileProvider>
          <Router>
            <MyNavbar />
            <DynamicBackground>
              <ToastContainer
                position="top-right"
                style={{ marginTop: "3rem" }}
              />
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/email-confirmation" element={<EmailConfirmationPage />} />
                <Route
                  path="/forgot-password"
                  element={<ForgotPasswordForm />}
                />
                <Route path="/reset-password" element={<ResetPasswordForm />} />
                <Route path="/courses" element={<CoursesPage />} />
                <Route path="/schedule" element={<SchedulePage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route
                  path="/course/register"
                  element={<CourseRegistrationPage />}
                />
                <Route path="/news" element={<NewsPage />} />
                <Route path="/contact" element={<ContactPage />} />
              </Routes>
            </DynamicBackground>
          </Router>
        </ProfileProvider>
      </AuthProvider>
    </ApiProvider>
  );
}

import PropTypes from 'prop-types';

function DynamicBackground({ children }) {
  const location = useLocation();

  // Determine the background image based on the current path
  const backgroundImage =
    location.pathname === "/register"
      ? "url('/slide1.jpg')"
      : location.pathname === "/login" || location.pathname === "/forgot-password"
      ? "url('/background.jpg')"
      : "url('/gray.jpg')";

  return (
    <main
      className="h-screen overflow-y-scroll bg-cover bg-center"
      style={{ backgroundImage }}
    >
      {children}
    </main>
  );
}

DynamicBackground.propTypes = {
  children: PropTypes.node.isRequired,
};

export default App;
