CREATE TYPE login_sources AS ENUM (
	'Window'
);

CREATE TABLE IF NOT EXISTS login_targets (
	slug VARCHAR(255) PRIMARY KEY,
	display_name VARCHAR(255),
	login_source login_sources
);
