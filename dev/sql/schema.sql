CREATE TYPE login_targets AS ENUM (
	'Page',
	'Popup'
);

CREATE TABLE IF NOT EXISTS login_pages (
	slug VARCHAR(255) PRIMARY KEY,
	page_name VARCHAR(255),
	login_target login_targets
);
