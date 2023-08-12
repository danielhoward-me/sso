import type User from './user';

export interface RawSession {
	id: string;
	ip: string;
	expires: string;
	user_id: string | null;
}
export interface Session {
	user: User | null;
}

export interface RawUser {
	id: string;
	username: string;
	email: string;
	created: string;
	updated: string;
}

export interface UserLoginData {
	id: string;
	password: string;
}

export interface SessionApiRequestBody {
	sessionId: string | undefined;
	ip: string;
}
