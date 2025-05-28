import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";
import { RootState } from "../store/store";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  isAdminSocket: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  isAdminSocket: false,
});

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isAdminSocket, setIsAdminSocket] = useState(false);
  const { isAuthenticated } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (isAuthenticated) {
      const token = localStorage.getItem("userToken");
      const adminToken = localStorage.getItem("adminToken");
      const currentToken = window.location.pathname.startsWith("/admin")
        ? adminToken
        : token;
      if (currentToken) {
        const isAdminConnection = window.location.pathname.startsWith("/admin");
        const newSocket = io(import.meta.env.VITE_API_BASE_URL, {
          auth: { token: currentToken },
          query: { isAdmin: isAdminConnection ? "true" : "false" },
        });
        setIsAdminSocket(isAdminConnection);
        newSocket.on("connect", () => {
          console.log("Connected to server");
          setIsConnected(true);
        });

        newSocket.on("disconnect", () => {
          console.log("Disconnected from server");
          setIsConnected(false);
        });

        setSocket(newSocket);

        return () => {
          newSocket.close();
        };
      }
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
        setIsConnected(false);
        setIsAdminSocket(false);
      }
    }
  }, [isAuthenticated]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, isAdminSocket }}>
      {children}
    </SocketContext.Provider>
  );
};
