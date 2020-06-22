const query_getUsers = `SELECT * FROM users`;

const query_getUserById = `SELECT * FROM users WHERE id = $1`;
const query_getUserByGoogleId = `SELECT * FROM users WHERE google_id = $1`;

const query_addUser = `
    INSERT INTO users
    (google_id, user_name, first_name, last_name, profile_image_url)
    VALUES
    ($1, $2, $3, $4, $5)
    RETURNING *;
`;

const query_updateUserName = `
    UPDATE users
    SET user_name = $2
    WHERE id = $1
    RETURNING *;
`;

const query_updateUserProfilePicture = `
  UPDATE users
  SET user_name = $2
  WHERE id = $1
  RETURNING *;
`;

const query_addMessage = `
  WITH insertedMessage AS (
    INSERT INTO messages
    (user_id, room_id, text)
    VALUES
    ($1, $2, $3)
    RETURNING *
  )
  SELECT insertedMessage.text, insertedMessage.user_id, insertedMessage.created_date, users.user_name
  FROM insertedMessage
  INNER JOIN users ON insertedMessage.user_id = users.id;
`;

const query_getMessagesForRoom = `
  SELECT messages.text, messages.user_id, messages.created_date, messages.room_id, users.user_name FROM messages
  LEFT JOIN users
  ON messages.user_id = users.id
  WHERE messages.room_id = $1;
`;

const query_addUserToRoom = `
  INSERT INTO active_users
  (user_id, socket_id, room_id)
  VALUES
  ($1, $2, $3)
`;

const query_getOneUserFromRoom = `
  SELECT * from active_users
  WHERE user_id=$1
  AND room_id=$2;
`;

const query_updateOneUserInRoom = `
  UPDATE active_users
  SET socket_id=$2
  WHERE user_id=$1
  AND room_id=$3;
`;

const query_deleteUserFromRoom = `
    DELETE FROM active_users
    WHERE socket_id = $1;
`;

const query_getActiveUsersInRoom = `
  SELECT
    users.id,
    users.user_name,
    users.first_name,
    users.last_name,
    profile_image_url
  FROM active_users
  LEFT JOIN users
  ON active_users.user_id = users.id
  WHERE active_users.room_id = $1;
`;

const query_getSocketIds = `
    SELECT socket_id FROM active_users;
`;

const query_getPublicRooms = `
    SELECT * FROM rooms WHERE is_private = false;
`;

const query_getPrivateRooms = `
  SELECT rooms.id, rooms.room_name, rooms.info_text, rooms.is_private FROM user_rooms
  INNER JOIN rooms
  ON user_rooms.room_id = rooms.id
  WHERE user_rooms.user_id = $1;
`;

const query_createPrivateRoom = `
    INSERT INTO rooms (room_name, is_private)
    VALUES ($1, $2)
    RETURNING *;
`;

const query_giveAccessToRoom = `
    INSERT INTO user_rooms (user_id, room_id, is_admin)
    VALUES ($1, $2, $3);
`;

export {
  query_getUsers,
  query_getUserById,
  query_addUser,
  query_getUserByGoogleId,
  query_updateUserName,
  query_updateUserProfilePicture,
  query_addMessage,
  query_getMessagesForRoom,
  query_addUserToRoom,
  query_deleteUserFromRoom,
  query_getActiveUsersInRoom,
  query_getOneUserFromRoom,
  query_updateOneUserInRoom,
  query_getSocketIds,
  query_getPublicRooms,
  query_getPrivateRooms,
  query_createPrivateRoom,
  query_giveAccessToRoom,
};
