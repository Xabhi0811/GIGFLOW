import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { socket } from "../socket";
import { useNotifications } from "../context/NotificationContext";
import NotificationDropdown from "./NotificationDropdown";

export default function Navbar() {
  const { user, setUser } = useAuth();
  const { notifications } = useNotifications();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
    navigate("/login");
  };

  // 🔌 Register socket once
  useEffect(() => {
    if (user) {
      socket.emit("register", user._id);
    }
  }, [user]);

  if (!user) return null;

  return (
    <nav className="flex justify-between items-center px-6 py-3 border-b bg-white">
      <h2 className="font-bold text-xl">GigFlow</h2>

      <div className="flex gap-6 items-center">
        {user.userType === "client" ? (
          <>
            <Link to="/client/dashboard">Dashboard</Link>
            <Link to="/client/post-gig">Post Gig</Link>

            {/* 🔔 Notification Bell */}
            <div className="relative">
              <button onClick={() => setOpen(!open)}>🔔</button>

              {notifications.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 rounded-full">
                  {notifications.length}
                </span>
              )}

              {open && (
                <NotificationDropdown
                  notifications={notifications}
                  onClose={() => setOpen(false)}
                />
              )}
            </div>
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
