"use strict";
var express = require("express");
var http = require("http");
var socketIO = require("socket.io");
var port = 4000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
server.listen(port, function () { return console.log("listening on port " + port + ".."); });
