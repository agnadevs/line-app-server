const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const port = 4000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

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
