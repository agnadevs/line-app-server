import express, { Request, Response } from "express";
import createNewUser from './users'
const bodyParser = require("body-parser")
const http = require("http");
const socketIO = require("socket.io");
const port = 4000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use((req:Request, res: Response, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  next();
});

app.use(express.json());

app.get("/api/healthCheck", (req: Request, res: Response)=> {
  res.send({message:"Gris"});
})

app.post("/api/users/newUser", (req: Request, res: Response) => {
  const userName = req.body.name;
  const userObj = createNewUser(userName);
  res.send(userObj)
  console.log(userObj)
})

interface ChatMessage {
  name: string;
  text: string;
}

io.on("connection", (socket: any) => {
  socket.on("message", (message: ChatMessage) => {
    console.log(JSON.stringify(message));
    const { name, text } = message;

    io.emit("message", { text, name, userId: socket.id });
  });

  socket.on("disconnect", (data: any) => {
    io.emit("admin-message", {
      name: "Admin",
      text: "A user has left the chat",
    });
  });
});

server.listen(port, () => console.log(`listening on port ${port}..`));
