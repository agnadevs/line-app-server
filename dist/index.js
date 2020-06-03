"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var users_1 = __importDefault(require("./users"));
var bodyParser = require("body-parser");
var http = require("http");
var socketIO = require("socket.io");
var port = 4000;
var app = express_1.default();
var server = http.createServer(app);
var io = socketIO(server);
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    next();
});
app.use(express_1.default.json());
app.get("/api/healthCheck", function (req, res) {
    res.send({ message: "Gris" });
});
app.post("/api/users/newUser", function (req, res) {
    var userName = req.body.name;
    var userObj = users_1.default(userName);
    res.send(userObj);
    console.log(userObj);
});
io.on("connection", function (socket) {
    socket.on("message", function (message) {
        console.log(JSON.stringify(message));
        var name = message.name, text = message.text;
        io.emit("message", { text: text, name: name, userId: socket.id });
    });
    socket.on("disconnect", function (data) {
        io.emit("admin-message", {
            name: "Admin",
            text: "A user has left the chat",
        });
    });
});
server.listen(port, function () { return console.log("listening on port " + port + ".."); });
