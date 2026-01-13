import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import FreelancerHome from "./freelancer/FreelancerHome";
import MyApplications from "./freelancer/MyApplications";
import FreelancerDashboard from "./freelancer/FreelancerDashboard";

import PostGig from "./pages/PostGig";
import ClientDashboard from "./pages/Dashboard";

import { useAuth } from "./context/AuthContext";

export default function App() {
  const { user, loading } = useAuth();
  if (loading) return <p>Loading...</p>;

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              user.userType === "client" ? (
                <Navigate to="/client/dashboard" />
              ) : (
                <Navigate to="/freelancer/home" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        
        <Route
          path="/freelancer/home"
          element={<ProtectedRoute><FreelancerHome /></ProtectedRoute>}
        />
        <Route
          path="/freelancer/applications"
          element={<ProtectedRoute><MyApplications /></ProtectedRoute>}
        />
        <Route
          path="/freelancer/dashboard"
          element={<ProtectedRoute><FreelancerDashboard /></ProtectedRoute>}
        />

       
        <Route
          path="/client/post-gig"
          element={<ProtectedRoute><PostGig /></ProtectedRoute>}
        />
        <Route
          path="/client/dashboard"
          element={<ProtectedRoute><ClientDashboard /></ProtectedRoute>}
        />
      </Routes>
    </BrowserRouter>
  );
}
