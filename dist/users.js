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
var db_1 = require("./database/db");
var queries_1 = require("./database/queries");
var mapper_1 = require("./mapper");
var addNewUser = function (sub, given_name, family_name, name, picture) { return __awaiter(void 0, void 0, void 0, function () {
    var response, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, db_1.executeQuery(queries_1.query_addUser, [
                        sub,
                        name,
                        given_name,
                        family_name,
                        picture,
                    ])];
            case 1:
                response = _a.sent();
                return [2 /*return*/, mapper_1.mapUserFromDB(response.rows[0])];
            case 2:
                err_1 = _a.sent();
                console.log(err_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.addNewUser = addNewUser;
var getUserByGoogleId = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.executeQuery(queries_1.query_getUserByGoogleId, [id])];
            case 1:
                response = _a.sent();
                return [2 /*return*/, !!response.rows.length ? mapper_1.mapUserFromDB(response.rows[0]) : null];
        }
    });
}); };
exports.getUserByGoogleId = getUserByGoogleId;
var updateUserName = function (id, newUserName) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.executeQuery(queries_1.query_updateUserName, [id, newUserName])];
            case 1:
                response = _a.sent();
                return [2 /*return*/, mapper_1.mapUserFromDB(response.rows[0])];
        }
    });
}); };
exports.updateUserName = updateUserName;
var updateUserProfilePicture = function (id, pictureURL) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.executeQuery(queries_1.query_updateUserProfilePicture, [
                    id,
                    pictureURL,
                ])];
            case 1:
                response = _a.sent();
                return [2 /*return*/, mapper_1.mapUserFromDB(response.rows[0])];
        }
    });
}); };
exports.updateUserProfilePicture = updateUserProfilePicture;
var addUserToRoom = function (userId, socketId, roomId) { return __awaiter(void 0, void 0, void 0, function () {
    var userExists, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                return [4 /*yield*/, db_1.executeQuery(queries_1.query_getOneUserFromRoom, [
                        userId,
                        roomId,
                    ])];
            case 1:
                userExists = _a.sent();
                if (!!!userExists.rows.length) return [3 /*break*/, 3];
                return [4 /*yield*/, db_1.executeQuery(queries_1.query_updateOneUserInRoom, [userId, socketId, roomId])];
            case 2:
                _a.sent();
                return [2 /*return*/];
            case 3: return [4 /*yield*/, db_1.executeQuery(queries_1.query_addUserToRoom, [userId, socketId, roomId])];
            case 4:
                _a.sent();
                return [3 /*break*/, 6];
            case 5:
                err_2 = _a.sent();
                console.log(err_2);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.addUserToRoom = addUserToRoom;
var getAllSocketIds = function () { return __awaiter(void 0, void 0, void 0, function () {
    var socketIdsInDb, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, db_1.executeQuery(queries_1.query_getSocketIds, [])];
            case 1:
                socketIdsInDb = _a.sent();
                return [2 /*return*/, socketIdsInDb.rows.map(function (row) {
                        return row.socket_id;
                    })];
            case 2:
                err_3 = _a.sent();
                console.log(err_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAllSocketIds = getAllSocketIds;
var deleteUserFromRoom = function (socketId) { return __awaiter(void 0, void 0, void 0, function () {
    var err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, db_1.executeQuery(queries_1.query_deleteUserFromRoom, [socketId])];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                err_4 = _a.sent();
                console.log(err_4);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteUserFromRoom = deleteUserFromRoom;
var getActiveUsersInRoom = function (roomId) { return __awaiter(void 0, void 0, void 0, function () {
    var activeUsers, mappedUsers;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.executeQuery(queries_1.query_getActiveUsersInRoom, [roomId])];
            case 1:
                activeUsers = _a.sent();
                mappedUsers = activeUsers.rows.map(function (user) {
                    return mapper_1.mapUserFromDB(user);
                });
                return [2 /*return*/, mappedUsers];
        }
    });
}); };
exports.getActiveUsersInRoom = getActiveUsersInRoom;
var removeInactiveSockets = function (activeSockets, databaseSockets) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        databaseSockets.forEach(function (socketId) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!activeSockets.includes(socketId)) return [3 /*break*/, 2];
                        return [4 /*yield*/, db_1.executeQuery(queries_1.query_deleteUserFromRoom, [socketId])];
                    case 1:
                        _a.sent();
                        console.info("Removed inactive socket: '" + socketId + "' at: " + new Date());
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); };
exports.removeInactiveSockets = removeInactiveSockets;
var getUserById = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.executeQuery(queries_1.query_getUserById, [id])];
            case 1:
                response = _a.sent();
                return [2 /*return*/, !!response.rows.length ? response.rows[0] : null];
        }
    });
}); };
exports.getUserById = getUserById;
