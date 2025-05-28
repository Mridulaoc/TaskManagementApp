import { Server } from "http";
import { Server as SocketServer, Socket } from "socket.io";
import { verifyToken } from "../utils/jwtService";

let io: SocketServer;

export const initializeSocket = (server: Server): void => {
  io = new SocketServer(server, {
    cors: {
      origin: process.env.CLIENT_URL || "*",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("Authentication error"));
      }
      const decoded = verifyToken(token);
      socket.data.userId = decoded.userId;
      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket: Socket) => {
    const userId = socket.data.userId;
    socket.join(`user:${userId}`);
    console.log(`User ${userId} connected`);
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};

export const getIO = (): SocketServer => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

export const emitToUsers = (
  userIds: string[],
  event: string,
  data: any
): void => {
  if (!io) {
    console.error("Socket.io not initialized!");
    return;
  }
  try {
    userIds.forEach((userId) => {
      const roomName = `user:${userId}`;
      io.to(roomName).emit(event, data);
    });
  } catch (error) {
    console.error(` Failed to emit event '${event}' to users:`, error);
  }
};
