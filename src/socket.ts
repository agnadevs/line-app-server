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
      const { room, user } = data;
      socket.join(room);
      const socketId: string = socket.id;

      await addUserToRoom(user.userId, socketId, room);

      const activeUsers = await getActiveUsersInRoom(room);
      io.in(room).emit("activeUsersInRoom", activeUsers);

      socket.to(room).emit("messageFromServer", {
        text: `${user.userName} has joined the room`,
        userName: "Line manager",
      });

      socket.on("messageFromClient", async (message: ChatMessage) => {
        const newMessage = await addNewMessage(message, room);
        io.in(room).emit("messageFromServer", newMessage);
      });
    });

    socket.on("leaveRoom", async (data: Data) => {
      const { room, user } = data;

      const activeUsers = await getActiveUsersInRoom(room);
      io.in(room).emit("activeUsersInRoom", activeUsers);
      socket.leave(room);

      socket.to(room).emit("messageFromServer", {
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
  room: string;
  user: {
    userName: string;
    userId: number;
  };
};
