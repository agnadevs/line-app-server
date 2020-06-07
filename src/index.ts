import express, { Request, Response } from "express";
import { addNewUser, getUsers } from "./users";
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

app.post("/api/users/newUser", async (req: Request, res: Response) => {
  const userName = req.body.name;
  const userObj = await addNewUser(userName);
  console.log("User saved");
  res.send(userObj);
});

interface ChatMessage {
  name: string;
  text: string;
  userId: string;
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
    socket.join(data.room);

    socket.on("message", (message: ChatMessage) => {
      const { name, text, userId } = message;
      io.to(data.room).emit("message", { text, name, userId });
    });
  });

  socket.on("leaveRoom", (data: Data) => {
    socket.leave(data.room);
    console.log(`${data.user.userName} left the room`);
    // socket.to(data.room).emit('');
  });

  socket.on("disconnect", (data: any) => {
    io.emit("admin-message", {
      name: "Admin",
      text: "A user has left the chat",
    });
  });
});

server.listen(port, () => console.log(`listening on port ${port}..`));
