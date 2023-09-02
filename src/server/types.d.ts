import type User from './user';

export interface RawSession {
	id: string;
	ip: string;
	expires: string;
	user_id: string | null;
}
export interface Session<T = null> {
	user: User | T;
}

export interface RawUser {
	id: string;
	username: string;
	email: string;
	profile_picture: ProfilePictureType;
	created: string;
	last_updated: string;
}

export interface SessionApiRequestBody {
	sessionId: string | undefined;
	ip: string;
}
