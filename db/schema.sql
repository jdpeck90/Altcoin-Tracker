DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS coins;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  fname VARCHAR(255),
  lname VARCHAR(225),
  email VARCHAR(255) UNIQUE,
  password_digest VARCHAR(255),
  follow_coin text ARRAY
);


CREATE TABLE coins (
  id SERIAL PRIMARY KEY,
  name VARCHAR (225),
  user_id INTEGER REFERENCES users(id)
  );
