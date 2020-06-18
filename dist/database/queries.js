"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.query_getSocketIds = exports.query_updateOneUserInRoom = exports.query_getOneUserFromRoom = exports.query_getActiveUsersInRoom = exports.query_deleteUserFromRoom = exports.query_addUserToRoom = exports.query_getMessagesForRoom = exports.query_addMessage = exports.query_updateUserProfilePicture = exports.query_updateUserName = exports.query_getUserByGoogleId = exports.query_addUser = exports.query_getUserById = exports.query_getUsers = void 0;
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
var query_getMessagesForRoom = "\n  SELECT messages.text, messages.user_id, messages.created_date, messages.room_id, users.user_name FROM messages\n  LEFT JOIN users\n  ON messages.user_id = users.id\n  WHERE messages.room_id = $1;\n";
exports.query_getMessagesForRoom = query_getMessagesForRoom;
var query_addUserToRoom = "\n  INSERT INTO active_users \n  (user_id, socket_id, room_id) \n  VALUES \n  ($1, $2, $3)\n";
exports.query_addUserToRoom = query_addUserToRoom;
var query_getOneUserFromRoom = "\n  SELECT * from active_users \n  WHERE user_id=$1 \n  AND room_id=$2;\n";
exports.query_getOneUserFromRoom = query_getOneUserFromRoom;
var query_updateOneUserInRoom = "\n  UPDATE active_users \n  SET socket_id=$2 \n  WHERE user_id=$1 \n  AND room_id=$3;\n";
exports.query_updateOneUserInRoom = query_updateOneUserInRoom;
var query_deleteUserFromRoom = "\n    DELETE FROM active_users\n    WHERE socket_id = $1;\n";
exports.query_deleteUserFromRoom = query_deleteUserFromRoom;
var query_getActiveUsersInRoom = "\n  SELECT \n    users.id, \n    users.user_name,\n    users.first_name,\n    users.last_name,\n    profile_image_url\n  FROM active_users\n  LEFT JOIN users\n  ON active_users.user_id = users.id\n  WHERE active_users.room_id = $1;\n";
exports.query_getActiveUsersInRoom = query_getActiveUsersInRoom;
var query_getSocketIds = "\n    SELECT socket_id FROM active_users;\n";
exports.query_getSocketIds = query_getSocketIds;
