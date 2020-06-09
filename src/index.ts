import express, { Request, Response } from "express";
import { addNewUser, getUsers } from "./users";
import { addNewMessage, getMessagesForRoom } from "./messages";
const bodyParser = require("body-parser");
const http = require("http");
const socketIO = require("socket.io");
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
    const users = await getUsers();
    res.send(users);
  } catch (err) {
    res.send(err);
  }
});

app.get("/api/chat/:room", async (req: Request, res: Response) => {
  const {room} = req.params
  try {
    const history = await getMessagesForRoom(room);
    res.send(history);
  } catch (err) {
    res.send(err);
  }
});

app.post("/api/users/newUser", async (req: Request, res: Response) => {
  const userName = req.body.name;
  const userObj = await addNewUser(userName);
  console.log("User saved");
  res.send(userObj);
});

type ChatMessage = {
  text: string;
  userName: string;
  userId: string;
  timestamp: string;
  roomId: string;
}


type Data = {
  room: string;
  user: {
    userName: string;
    userId: string;
  };
};


io.on("connection", (socket: any) => {
  socket.on("joinRoom", (data: Data) => {
    const {room, user} = data;

    socket.join(room);
    socket.to(room).broadcast.emit('messageFromServer',{ text: `${user.userName} has joined the room`,
      userName: "Line manager",
      });

    socket.on("messageFromClient", async (message: ChatMessage) => {
      const {text, userName, userId, timestamp, roomId } = message;
      const newMessage = await addNewMessage(message, room)

      io.to(room).emit("messageFromServer", newMessage);
    });
  });

  socket.on("leaveRoom", (data: Data) => {
    const {room, user} = data
    socket.leave(room);

    socket.to(room).broadcast.emit('messageFromServer',{ text: `${user.userName} has left the room`,
      userName: "Line manager",
      });
  });

  socket.on("disconnect", (data: any) => {
  });
});

server.listen(port, () => console.log(`listening on port ${port}..`));
