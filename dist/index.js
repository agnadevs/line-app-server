"use strict";
var express = require("express");
var http = require("http");
var socketIO = require("socket.io");
var port = 4000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
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
