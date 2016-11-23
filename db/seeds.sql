DROP TABLE if EXISTS messages;

CREATE TABLE messages(
    id SERIAL PRIMARY KEY,
    phrase VARCHAR NOT NULL
);

INSERT INTO messages (phrase) VALUES ('Hi, Welcome to our first heroku app!');
INSERT INTO messages (phrase) VALUES ('Heroku is a fun place to deploy your app');
INSERT INTO messages (phrase) VALUES ('Heroku is free');
INSERT INTO messages (phrase) VALUES ('Which is good');
