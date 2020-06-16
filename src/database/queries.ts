const query_getUsers = `SELECT * FROM users`;

const query_getUserById = `SELECT * FROM users WHERE id = $1`;
const query_getUserByGoogleId = `SELECT * FROM users WHERE google_id = $1`;

const query_addUser = `
    INSERT INTO users 
    (google_id, user_name, first_name, last_name, profile_image_url) 
    VALUES 
    ($1, $2, $3, $4, $5) 
    RETURNING *
`;

export { query_getUsers, query_getUserById, query_addUser, query_getUserByGoogleId };
