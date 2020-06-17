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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var users_1 = require("./users");
var messages_1 = require("./messages");
var socket_1 = require("./socket");
var http = require("http");
var OAuth2Client = require("google-auth-library").OAuth2Client;
var client = new OAuth2Client(process.env.CLIENT_ID);
var port = 4000;
var app = express_1.default();
var server = http.createServer(app);
socket_1.connectSocket(server);
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");
    next();
});
app.use(express_1.default.json());
app.get("/api/healthCheck", function (req, res) {
    res.send({ message: "Gris" });
});
app.put("/api/users/update", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userName, userId, updatedUser, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, userName = _a.userName, userId = _a.userId;
                return [4 /*yield*/, users_1.updateUserName(userId, userName)];
            case 1:
                updatedUser = _b.sent();
                res.send({ error: null, data: updatedUser });
                return [3 /*break*/, 3];
            case 2:
                err_1 = _b.sent();
                res.send({ error: err_1, data: null });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get("/api/chat/:room", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var room, history_1, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                room = req.params.room;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, messages_1.getMessagesForRoom(room)];
            case 2:
                history_1 = _a.sent();
                res.send({ error: null, data: history_1 });
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                res.send({ error: err_2, data: null });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// CURRENTLY UPDATING TO USE DATABASE
app.post("/api/login", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id_token, payload, sub, name_1, given_name, family_name, picture, existingUser, userId, updatedUser, newUser, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                id_token = req.body.accessToken;
                return [4 /*yield*/, verify(id_token).catch(function (err) { })];
            case 1:
                payload = _a.sent();
                sub = payload.sub, name_1 = payload.name, given_name = payload.given_name, family_name = payload.family_name, picture = payload.picture;
                return [4 /*yield*/, users_1.getUserByGoogleId(sub)];
            case 2:
                existingUser = _a.sent();
                if (!existingUser) return [3 /*break*/, 4];
                if (existingUser.profileImageURL === picture) {
                    res.send({ error: null, data: existingUser }); //NEED TO MAP EXISTING USER BEFORE RES.SEND BACK
                    return [2 /*return*/];
                }
                userId = existingUser.userId;
                return [4 /*yield*/, users_1.updateUserProfilePicture(userId, picture)];
            case 3:
                updatedUser = _a.sent();
                res.send({ error: null, data: updatedUser });
                return [2 /*return*/];
            case 4: return [4 /*yield*/, users_1.addNewUser(sub, given_name, family_name, name_1, picture)];
            case 5:
                newUser = _a.sent();
                res.send({ error: null, data: newUser });
                return [3 /*break*/, 7];
            case 6:
                err_3 = _a.sent();
                res.send({ error: err_3, data: null });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
function verify(token) {
    return __awaiter(this, void 0, void 0, function () {
        var ticket, payload;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.verifyIdToken({
                        idToken: token,
                        audience: process.env.CLIENT_ID,
                    })];
                case 1:
                    ticket = _a.sent();
                    payload = ticket.getPayload();
                    return [2 /*return*/, payload];
            }
        });
    });
}
server.listen(port, function () { return console.log("listening on port " + port + ".."); });
