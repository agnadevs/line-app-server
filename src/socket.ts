const socketIO = require("socket.io");
import {
  addUserToRoom,
  deleteUserFromRoom,
  getActiveUsersInRoom,
} from "./users";
import { addNewMessage } from "./messages";
import { ChatMessage } from "./types";

export const connectSocket = (server: any) => {
  const io = socketIO(server);

  io.on("connection", (socket: any) => {
    socket.on("joinRoom", async (data: Data) => {
      const { roomId, user } = data;
      socket.join(roomId);
      const socketId: string = socket.id;

      await addUserToRoom(user.userId, socketId, roomId);

      const activeUsers = await getActiveUsersInRoom(roomId);
      io.in(roomId).emit("activeUsersInRoom", activeUsers);

      socket.to(roomId).emit("messageFromServer", {
        text: `${user.userName} has joined the room`,
        userName: "Line manager",
      });

      socket.on("messageFromClient", async (message: ChatMessage) => {
        const newMessage = await addNewMessage(message, roomId);
        io.in(roomId).emit("messageFromServer", newMessage);
      });
    });

    socket.on("leaveRoom", async (data: Data) => {
      const { roomId, user } = data;

      const activeUsers = await getActiveUsersInRoom(roomId);
      io.in(roomId).emit("activeUsersInRoom", activeUsers);
      socket.leave(roomId);

      socket.to(roomId).emit("messageFromServer", {
        text: `${user.userName} has left the room`,
        userName: "Line manager",
      });
    });

    socket.on("disconnect", async () => {
      await deleteUserFromRoom(socket.id);
    });
  });
  async function getActiveClients() {
    let result: any;
    await io.of("/").clients((error: any, clients: any) => {
      if (error) throw error;
      result = clients;
    });
    return result;
  }

  return { getActiveClients };
};

type Data = {
  roomId: string;
  user: {
    userName: string;
    userId: number;
  };
};
