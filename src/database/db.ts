const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const executeQuery = async (
  sql: string,
  params: (string | number)[]
) => {
  const client = await pool.connect();
  console.log("connected");
  try {
    const res = await client.query(sql, params);
    return res;
  } catch (err) {
    console.log(err);
  } finally {
    console.log("connection released");
    client.release();
  }
};

/*

DROP TABLE IF EXISTS users;
CREATE TABLE users (
	id serial not null PRIMARY KEY,
  google_id varchar not null unique,
  user_name varchar not null,
	first_name varchar not null,
	last_name varchar not null,
	profile_image_url varchar,
	created_date timestamp default current_timestamp
);

DROP TABLE IF EXISTS messages;
CREATE TABLE messages (
  id serial not null PRIMARY KEY,
  user_id integer not null,
  FOREIGN KEY (user_id) REFERENCES users (id),
  room_id varchar not null,
  text varchar not null,
	created_date timestamp default current_timestamp 
);

DROP TABLE IF EXISTS active_users;
CREATE TABLE active_users (
  id serial not null PRIMARY KEY,
  user_id integer not null,
  FOREIGN KEY (user_id) REFERENCES users (id),
  socket_id varchar not null,
  room_id varchar not null,
	created_date timestamp default current_timestamp 
);

DROP TABLE IF EXISTS rooms;
CREATE TABLE rooms (
	id serial not null PRIMARY KEY,
	title integer not null,
	user_id integer not null,
	info_text varchar not null
);


*/
