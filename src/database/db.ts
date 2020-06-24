const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const executeQuery = async (
  sql: string,
  params: (string | number | boolean)[]
) => {
  const client = await pool.connect();
  try {
    const res = await client.query(sql, params);
    return res;
  } catch (err) {
    console.log(err);
  } finally {
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
*/

/** 
  DROP TABLE IF EXISTS active_users;
  DROP TABLE IF EXISTS user_rooms;
  DROP TABLE IF EXISTS messages;
  DROP TABLE IF EXISTS rooms;

CREATE TABLE rooms (
	id serial not null PRIMARY KEY,
	room_name varchar not null,
	is_private boolean not null,
  admin_id integer,
  FOREIGN KEY (admin_id) REFERENCES users (id)
);

INSERT INTO rooms (room_name, is_private, admin_id) 
VALUES ('general', false, null);

INSERT INTO rooms (room_name, is_private, admin_id) 
VALUES ('react', false, null);

INSERT INTO rooms (room_name, is_private, admin_id) 
VALUES ('vue', false, null);

INSERT INTO rooms (room_name, is_private, admin_id) 
VALUES ('node', false, null);

CREATE TABLE messages (
	id serial not null PRIMARY KEY,
	user_id integer not null,
	FOREIGN KEY (user_id) REFERENCES users (id),
	room_id integer not null,
	FOREIGN KEY (room_id) REFERENCES rooms (id),
	text varchar not null,
	created_date timestamp default current_timestamp 
);

CREATE TABLE user_rooms (
  id serial not null PRIMARY KEY,
  user_id integer not null,
	FOREIGN KEY (user_id) REFERENCES users (id),
	room_id integer not null,
  FOREIGN KEY (room_id) REFERENCES rooms (id),
  created_date timestamp default current_timestamp
);

CREATE TABLE active_users (
  id serial not null PRIMARY KEY,
  user_id integer not null,
  FOREIGN KEY (user_id) REFERENCES users (id),
  socket_id varchar not null,
  room_id integer not null,
  FOREIGN KEY (room_id) REFERENCES rooms (id),
	created_date timestamp default current_timestamp 
);
*/
