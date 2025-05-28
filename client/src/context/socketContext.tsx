import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";
import { RootState } from "../store/store";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
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
  const { isAuthenticated } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    console.log("IsAutenticated", isAuthenticated);
    if (isAuthenticated) {
      const token = localStorage.getItem("userToken");

      if (token) {
        const newSocket = io(import.meta.env.VITE_API_BASE_URL, {
          auth: { token },
        });

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
      }
    }
  }, [isAuthenticated]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
