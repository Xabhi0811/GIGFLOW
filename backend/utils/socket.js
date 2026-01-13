import { userSocketMap } from "./socketMap.js";

let ioInstance;

export const initSocket = (io) => {
  ioInstance = io;

  io.on("connection", (socket) => {
    console.log("🔌 Socket connected:", socket.id);

    socket.on("register", (userId) => {
      userSocketMap.set(userId.toString(), socket.id);
      console.log("✅ User registered:", userId);
    });

    socket.on("disconnect", () => {
      for (const [userId, socketId] of userSocketMap.entries()) {
        if (socketId === socket.id) {
          userSocketMap.delete(userId);
        }
      }
      console.log("❌ Socket disconnected:", socket.id);
    });
  });
};

export const getIO = () => ioInstance;
