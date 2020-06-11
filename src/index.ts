import express, { Request, Response } from "express";
import {
  addNewUser,
  getUsers,
  addUserToRoom,
  deleteUserFromRoom,
} from "./users";
import { ChatMessage, User } from "./types";
import { addNewMessage, getMessagesForRoom } from "./messages";
const bodyParser = require("body-parser");
const http = require("http");
const socketIO = require("socket.io");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);
const port = 4000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use((req: Request, res: Response, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  next();
});

app.use(express.json());

app.get("/api/healthCheck", (req: Request, res: Response) => {
  res.send({ message: "Gris" });
});

app.get("/api/users", async (req: Request, res: Response) => {
  try {
    const users: User[] = await getUsers();
    res.send({ error: null, data: users });
  } catch (err) {
    res.send({ error: err, data: null });
  }
});

app.get("/api/chat/:room", async (req: Request, res: Response) => {
  const { room } = req.params;
  try {
    const history = await getMessagesForRoom(room);
    res.send({ error: null, data: history });
  } catch (err) {
    res.send({ error: err, data: null });
  }
});

app.post("/api/login", async (req: Request, res: Response) => {
  try {
    const id_token = req.body.accessToken;
    const payload = await verify(id_token).catch((err) => {});
    const { sub, name, given_name, family_name } = payload;
    const users = await getUsers();
    const existingUser = users.find((user: User) => user.userId === sub);

    if (existingUser) {
      res.send(existingUser);
    }
    const newUser = await addNewUser(sub, name, given_name, family_name);
    res.send({ error: null, data: newUser });
    return;
  } catch (err) {
    res.send({ error: err, data: null });
  }
});

async function verify(token: string) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return payload;
}

type Data = {
  room: string;
  user: {
    userName: string;
    userId: string;
  };
};

io.on("connection", (socket: any) => {
  socket.on("joinRoom", async (data: Data) => {
    const { room, user } = data;
    socket.join(room);
    const socketId: string = socket.id;
    const newUser = { ...user, socketId };
    const activeUsers = await addUserToRoom(newUser, room);
    io.in(room).emit("activeUsersInRoom", activeUsers);

    const apa = io.sockets.adapter.rooms[room];

    socket.to(room).emit("messageFromServer", {
      text: `${user.userName} has joined the room`,
      userName: "Line manager",
    });

    socket.on("messageFromClient", async (message: ChatMessage) => {
      const { text, userName, userId, timestamp, roomId } = message;
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

server.listen(port, () => console.log(`listening on port ${port}..`));
