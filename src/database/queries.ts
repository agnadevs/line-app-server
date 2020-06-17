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

/*

SELECT messages.text, messages.user_id, messages.created_date, users.user_name FROM messages
LEFT JOIN users
ON messages.user_id = users.id
WHERE messages.room_id = 'react';
*/

const query_getMessagesForRoom = `
  SELECT messages.text, messages.user_id, messages.created_date, messages.room_id, users.user_name FROM messages
  LEFT JOIN users
  ON messages.user_id = users.id
  WHERE messages.room_id = $1;
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
};
