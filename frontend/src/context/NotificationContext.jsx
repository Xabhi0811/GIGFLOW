import { createContext, useContext, useEffect, useState } from "react";
import { socket } from "../socket";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    socket.on("new-notification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => socket.off("new-notification");
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
