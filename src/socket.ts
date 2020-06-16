const socketIO = require("socket.io");
import { addUserToRoom, deleteUserFromRoom } from "./users";
import { addNewMessage } from "./messages";
import { ChatMessage } from "./types";

export const connectSocket = (server: any) => {
  const io = socketIO(server);

  io.on("connection", (socket: any) => {
    socket.on("joinRoom", async (data: Data) => {
      const { room, user } = data;
      socket.join(room);
      const socketId: string = socket.id;
      const newUser = { ...user, socketId };
      const activeUsers = await addUserToRoom(newUser, room);
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
      const activeUsers = await deleteUserFromRoom(user, room);
      io.in(room).emit("activeUsersInRoom", activeUsers);
      socket.leave(room);

      socket.to(room).emit("messageFromServer", {
        text: `${user.userName} has left the room`,
        userName: "Line manager",
      });
    });

    socket.on("disconnect", (data: any) => {});
  });
};

type Data = {
  room: string;
  user: {
    userName: string;
    userId: string;
  };
};
