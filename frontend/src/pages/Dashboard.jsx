import { useEffect, useState } from "react";
import api from "../api/axios";
import { socket } from "../socket";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user?._id) {
      socket.emit("register", user._id);
    }

    socket.on("hired", (data) => {
      setMessage(data.message);
    });

    return () => socket.off("hired");
  }, [user]);

  return (
    <div className="p-6">
      <h2>Dashboard</h2>
      {message && <p className="text-green-600">{message}</p>}
    </div>
  );
}
