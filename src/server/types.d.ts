import type User from './/user';

export interface RawSession {
	id: string;
	ip: string;
	expires: string;
	user_id: string | null;
}

export interface Session {
	user: User | null;
}
