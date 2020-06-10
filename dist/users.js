"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserFromRoom = exports.addUserToRoom = exports.getUsers = exports.addNewUser = void 0;
var uuid_1 = require("uuid");
var utils_1 = require("./utils");
var getUsers = function () { return __awaiter(void 0, void 0, void 0, function () {
    var users;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, utils_1.getFormatedDataFromJSON("dist/users.json")];
            case 1:
                users = (_a.sent()).users;
                return [2 /*return*/, users];
        }
    });
}); };
exports.getUsers = getUsers;
var addNewUser = function (userName) { return __awaiter(void 0, void 0, void 0, function () {
    var users, newUser, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, utils_1.getFormatedDataFromJSON("dist/users.json")];
            case 1:
                users = (_a.sent()).users;
                newUser = {
                    userName: userName,
                    userId: uuid_1.v4(),
                    createdAt: new Date(),
                };
                users.push(newUser);
                return [4 /*yield*/, utils_1.writeDataToJSON("dist/users.json", { users: users })];
            case 2:
                _a.sent();
                return [2 /*return*/, newUser];
            case 3:
                err_1 = _a.sent();
                console.log(err_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.addNewUser = addNewUser;
var addUserToRoom = function (user, room) { return __awaiter(void 0, void 0, void 0, function () {
    var rooms, existingUser, activeUsersInRoom, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, utils_1.getFormatedDataFromJSON("dist/rooms.json")];
            case 1:
                rooms = (_a.sent()).rooms;
                existingUser = rooms[room].find(function (currentUser) { return user.userId === currentUser.userId; });
                if (!!existingUser) {
                    rooms[room].find(function (currentUser) { return user.userId === currentUser.userId; }).socketId = user.socketId;
                }
                else {
                    rooms[room].push(user);
                }
                return [4 /*yield*/, utils_1.writeDataToJSON("dist/rooms.json", { rooms: rooms })];
            case 2:
                _a.sent();
                activeUsersInRoom = rooms[room];
                return [2 /*return*/, activeUsersInRoom];
            case 3:
                err_2 = _a.sent();
                console.log(err_2);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.addUserToRoom = addUserToRoom;
var deleteUserFromRoom = function (user, room) { return __awaiter(void 0, void 0, void 0, function () {
    var rooms, arrayWhenUserIsRemoved, activeUsersInRoom, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, utils_1.getFormatedDataFromJSON("dist/rooms.json")];
            case 1:
                rooms = (_a.sent()).rooms;
                arrayWhenUserIsRemoved = rooms[room].filter(function (currentUser) {
                    return user.userId !== currentUser.userId;
                });
                rooms[room] = arrayWhenUserIsRemoved;
                return [4 /*yield*/, utils_1.writeDataToJSON("dist/rooms.json", { rooms: rooms })];
            case 2:
                _a.sent();
                activeUsersInRoom = rooms[room];
                return [2 /*return*/, activeUsersInRoom];
            case 3:
                err_3 = _a.sent();
                console.log(err_3);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.deleteUserFromRoom = deleteUserFromRoom;
