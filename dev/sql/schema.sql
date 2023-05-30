CREATE TABLE IF NOT EXISTS sessions (
	id uuid PRIMARY KEY,
	ip inet,
	expires timestamp,
	user_id uuid
);
