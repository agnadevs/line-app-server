const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const executeQuery = async (sql: string, params: string[]) => {
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



*/