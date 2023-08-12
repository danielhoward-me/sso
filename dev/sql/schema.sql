CREATE TABLE users (
	id UUID PRIMARY KEY,
	username TEXT UNIQUE,
	password TEXT,
	email VARCHAR(256) UNIQUE,
	created TIMESTAMP,
	updated TIMESTAMP
);

CREATE TABLE sessions (
	id UUID PRIMARY KEY,
	ip INET,
	expires TIMESTAMP,
	user_id UUID REFERENCES users(id)
);

