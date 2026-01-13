import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { socket } from "../socket";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) return;

    api.get("/notifications").then(res => {
      setNotifications(res.data.filter(n => !n.isRead));
    });

    socket.on("new-notification", notif => {
      setNotifications(prev => [notif, ...prev]);
    });

    return () => socket.off("new-notification");
  }, [user]);

  const markRead = async (id) => {
    await api.put(`/notifications/${id}/read`);
    setNotifications(prev => prev.filter(n => n._id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notifications, markRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
