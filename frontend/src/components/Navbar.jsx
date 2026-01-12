import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
    navigate("/login");
  };

  if (!user) return null;

  return (
    <nav className="flex justify-between items-center px-6 py-3 border-b bg-white">
      <h2 className="font-bold text-xl">GigFlow</h2>

      <div className="flex gap-4 items-center">
        {user.userType === "client" ? (
          <>
            <Link to="/client/dashboard">Dashboard</Link>
            <Link to="/client/post-gig">Post Gig</Link>
          </>
        ) : (
          <>
            <Link to="/freelancer/home">Browse Gigs</Link>
            <Link to="/freelancer/applications">My Applications</Link>
            <Link to="/freelancer/dashboard">Dashboard</Link>
          </>
        )}

        <button onClick={logout} className="px-3 py-1 border rounded">
          Logout
        </button>
      </div>
    </nav>
  );
}
