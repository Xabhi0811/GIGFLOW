import { useEffect, useState } from "react";
import { socket } from "../../socket";
import { useAuth } from "../../context/AuthContext";

export default function FreelancerDashboard() {
  const { user } = useAuth();
  const [notification, setNotification] = useState("");

  useEffect(() => {
    socket.emit("register", user._id);

    socket.on("hired", data => {
      setNotification(data.message);
    });

    return () => socket.off("hired");
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl">Freelancer Dashboard</h2>

      {notification && (
        <p className="mt-4 text-green-600">{notification}</p>
      )}
    </div>
  );
}
