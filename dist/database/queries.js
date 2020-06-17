"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.query_getMessagesForRoom = exports.query_addMessage = exports.query_updateUserProfilePicture = exports.query_updateUserName = exports.query_getUserByGoogleId = exports.query_addUser = exports.query_getUserById = exports.query_getUsers = void 0;
var query_getUsers = "SELECT * FROM users";
exports.query_getUsers = query_getUsers;
var query_getUserById = "SELECT * FROM users WHERE id = $1";
exports.query_getUserById = query_getUserById;
var query_getUserByGoogleId = "SELECT * FROM users WHERE google_id = $1";
exports.query_getUserByGoogleId = query_getUserByGoogleId;
var query_addUser = "\n    INSERT INTO users \n    (google_id, user_name, first_name, last_name, profile_image_url) \n    VALUES \n    ($1, $2, $3, $4, $5) \n    RETURNING *;\n";
exports.query_addUser = query_addUser;
var query_updateUserName = "\n    UPDATE users \n    SET user_name = $2 \n    WHERE id = $1\n    RETURNING *;\n";
exports.query_updateUserName = query_updateUserName;
var query_updateUserProfilePicture = "\n  UPDATE users \n  SET user_name = $2\n  WHERE id = $1\n  RETURNING *;\n";
exports.query_updateUserProfilePicture = query_updateUserProfilePicture;
var query_addMessage = "\n  WITH insertedMessage AS (\n    INSERT INTO messages \n    (user_id, room_id, text) \n    VALUES \n    ($1, $2, $3)\n    RETURNING *\n  )\n  SELECT insertedMessage.text, insertedMessage.user_id, insertedMessage.created_date, users.user_name\n  FROM insertedMessage\n  INNER JOIN users ON insertedMessage.user_id = users.id;\n";
exports.query_addMessage = query_addMessage;
/*

SELECT messages.text, messages.user_id, messages.created_date, users.user_name FROM messages
LEFT JOIN users
ON messages.user_id = users.id
WHERE messages.room_id = 'react';
*/
var query_getMessagesForRoom = "\n  SELECT messages.text, messages.user_id, messages.created_date, messages.room_id, users.user_name FROM messages\n  LEFT JOIN users\n  ON messages.user_id = users.id\n  WHERE messages.room_id = $1;\n";
exports.query_getMessagesForRoom = query_getMessagesForRoom;