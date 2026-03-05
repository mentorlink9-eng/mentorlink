import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider, useAuth, ProfileRedirect } from "./contexts/AuthContext";
import { ChatProvider } from "./contexts/ChatContext";
import { SettingsProvider } from "./contexts/SettingsContext";
import { LayoutProvider } from "./contexts/LayoutContext";

// === Layout ===
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Navbar from "./components/layout/navbar/Navbar";
import Footer from "./components/layout/footer/Footer";

// === Landing / Public ===
import Landing from "./pages/landing/home/Landing";
import ContactPage from "./pages/landing/contact/ContactPage";
import TermsAndConditions from "./pages/landing/terms/TermsAndConditions";
import PrivacyPolicy from "./pages/landing/privacy/PrivacyPolicy";
import FAQs from "./pages/landing/faqs/FAQs";

// === Auth ===
import Login from "./pages/auth/login/Login";
import Signup from "./pages/auth/signup/Signup";
import EmailOtp from "./pages/auth/otp/EmailOtp";

// === Onboarding ===
import StudentForm from "./pages/onboarding/student-form/StudentForm";
import MentorForm from "./pages/onboarding/mentor-form/MentorForm";
import EventOrganizer from "./pages/onboarding/organizer-form/EventOrganizer";

// === Home ===
import HomePage from "./pages/home/HomePage";

// === Mentors ===
import Mentors from "./pages/mentors/browse/Mentors";
import MentorProfile from "./pages/mentors/profile/MentorProfile";
import MentorBriefProfile from "./pages/mentors/brief-profile/MentorBriefProfile";
import RequestReview from "./pages/mentors/request-review/RequestReview";

// === Students ===
import Students from "./pages/students/browse/Students";
import StudentProfile from "./pages/students/profile/StudentProfile";
import ConnectionRequestView from "./pages/students/connection-request/ConnectionRequestView";

// === Events ===
import Events from "./pages/events/browse/Events";
import EventInfo from "./pages/events/details/EventInfo";
import HostEventForm from "./pages/events/host/HostEventForm";

// === Organizer ===
import OrganizerProfile from "./pages/organizer/profile/OrganizerProfile";

// === Messages ===
import Messages from "./pages/messages/chat/Messages";

// === Settings ===
import Settings from "./pages/settings/Settings";

// === Admin ===
import AdminDashboard from "./pages/admin/AdminDashboard";

function AppContent() {
  const location = useLocation();
  const { loading } = useAuth();

  // Pages that should NOT show the default navbar
  const isLoginPage = location.pathname === "/login";
  const isSignupPage = location.pathname === "/signup";
  const isOtpPage = location.pathname === "/otp";
  const isFormPage = [
    "/student-form",
    "/mentor-form",
    "/event-organizer"
  ].includes(location.pathname);
  const isAppPage = [
    "/home",
    "/student-profile",
    "/organizer-profile",
    "/mentor-profile",
    "/events",
    "/mentors",
    "/students",
    "/settings",
    "/host-an-event",
    "/admin"
  ].includes(location.pathname) ||
    location.pathname.startsWith("/messages") ||
    location.pathname.startsWith("/mentors/") ||
    location.pathname.startsWith("/students/") ||
    location.pathname.startsWith("/mentor-profile/");

  if (loading) return <div>Loading...</div>;

  return (
    <>
      {!isLoginPage && !isSignupPage && !isOtpPage && !isFormPage && !isAppPage && <Navbar />}

      <Routes>
        {/* === Landing / Public === */}
        <Route path="/" element={<Landing />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/faqs" element={<FAQs />} />

        {/* === Auth === */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/otp" element={<EmailOtp />} />

        {/* === Onboarding === */}
        <Route path="/student-form" element={<StudentForm />} />
        <Route path="/mentor-form" element={<MentorForm />} />
        <Route path="/event-organizer" element={<EventOrganizer />} />

        {/* === Profile Redirect === */}
        <Route path="/profile" element={<ProfileRedirect />} />

        {/* === Home === */}
        <Route path="/home" element={<HomePage />} />

        {/* === Mentors === */}
        <Route path="/mentors" element={<Mentors />} />
        <Route path="/mentors/:id" element={<MentorBriefProfile />} />
        <Route path="/mentor-profile/:id" element={<MentorProfile />} />
        <Route
          path="/mentor-profile"
          element={
            <ProtectedRoute requiredRole="mentor">
              <MentorProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentor-profile/requests/:requestId"
          element={
            <ProtectedRoute requiredRole="mentor">
              <RequestReview />
            </ProtectedRoute>
          }
        />

        {/* === Students === */}
        <Route path="/students" element={<Students />} />
        <Route path="/students/:id" element={<StudentProfile />} />
        <Route
          path="/student-profile"
          element={
            <ProtectedRoute requiredRole="student">
              <StudentProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/connection-request/:requestId"
          element={<ConnectionRequestView />}
        />

        {/* === Events === */}
        <Route path="/events" element={<Events />} />
        <Route path="/events/:eventId" element={<EventInfo />} />
        <Route path="/host-an-event" element={<HostEventForm />} />

        {/* === Organizer === */}
        <Route
          path="/organizer-profile"
          element={
            <ProtectedRoute requiredRole="organizer">
              <OrganizerProfile key={Date.now()} />
            </ProtectedRoute>
          }
        />

        {/* === Messages === */}
        <Route path="/messages" element={<Messages />} />
        <Route path="/messages/:userId" element={<Messages />} />

        {/* === Settings === */}
        <Route path="/settings" element={<Settings />} />

        {/* === Admin === */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>

      {!isLoginPage && !isAppPage && <Footer />}
    </>
  );
}

function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <ChatProvider>
          <LayoutProvider>
            <AppContent />
          </LayoutProvider>
        </ChatProvider>
      </AuthProvider>
    </SettingsProvider>
  );
}

export default App;