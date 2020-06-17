"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapUserFromDB = exports.mapMessageFromDB = void 0;
var mapMessageFromDB = function (messageObj) {
    return {
        userId: messageObj.user_id,
        userName: messageObj.user_name,
        text: messageObj.text,
        timestamp: messageObj.created_date
    };
};
exports.mapMessageFromDB = mapMessageFromDB;
var mapUserFromDB = function (userObj) {
    return {
        userId: userObj.id,
        userName: userObj.user_name,
        firstName: userObj.first_name,
        lastName: userObj.last_name,
        profileImageURL: userObj.profile_image_url,
    };
};
exports.mapUserFromDB = mapUserFromDB;
