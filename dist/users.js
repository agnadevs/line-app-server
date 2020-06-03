"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var uuid_1 = require("uuid");
var fs_1 = __importDefault(require("fs"));
exports.default = (function (userName) {
    fs_1.default.readFile('dist/users.json', 'utf8', function (err, data) {
        if (err)
            throw err;
        console.log('File read ---- ', data);
    });
    var newUser = {
        userName: userName,
        userId: uuid_1.v4(),
        createdAt: new Date()
    };
    fs_1.default.appendFile('dist/users.json', JSON.stringify(newUser, null, 2), function (err) {
        if (err)
            throw err;
        console.log('Saved!');
    });
    return newUser;
});
// export default = {
//  createNewUser,
//  ...,
//}
