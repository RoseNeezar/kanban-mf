import { useSocketStore } from "@store/useSocket.store";
import { useEffect } from "react";
import { useQueryClient } from "react-query";
import { io } from "socket.io-client";

const useSocket = (boardId: string) => {
  const { setSocket, setSocketLoaded } = useSocketStore();

  const cache = useQueryClient();

  useEffect(() => {
    const socket = io("http://localhost:3030", {
      withCredentials: true,
      path: "/kanban/socket.io",
    });

    setSocket(socket);

    socket.emit("setup", boardId);

    socket.on("connected", () => {
      console.log("pog");
      setSocketLoaded();
    });
    socket.on("create-list", (data: any) => {
      console.log("pog-", data);
    });
  }, []);
};

export default useSocket;
