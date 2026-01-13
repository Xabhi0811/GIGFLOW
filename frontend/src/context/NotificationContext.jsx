import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { socket } from "../socket";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // fetch from DB
  useEffect(() => {
    api.get("/notifications").then((res) => {
      setNotifications(res.data);
    });
  }, []);

  // realtime socket
  useEffect(() => {
    socket.on("new-notification", (notification) => {
      console.log("SOCKET NOTIFICATION:", notification); // 👈 DEBUG
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => socket.off("new-notification");
  }, []);

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n._id !== id));
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, removeNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
