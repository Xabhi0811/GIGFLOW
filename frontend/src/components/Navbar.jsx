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
    <nav className="flex justify-between px-6 py-3 border-b">
      <h2 className="font-bold">GigFlow</h2>
      <div className="flex gap-4">
        <Link to="/home">Home</Link>
        <Link to="/post-gig">Post Gig</Link>
        <Link to="/dashboard">Dashboard</Link>
        <button onClick={logout}>Logout</button>
      </div>
    </nav>
  );
}
