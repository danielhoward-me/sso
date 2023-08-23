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

// Should match schema.sql profile_picture
export type ProfilePictureType = 'custom' | 'identicon' | 'monsterid' | 'wavatar' | 'retro' | 'robohash';
export interface RawUser {
	id: string;
	username: string;
	email: string;
	profile_picture: ProfilePictureType;
	created: string;
	last_updated: string;
}

export interface UserLoginData {
	id: string;
	password: string;
}

export interface SessionApiRequestBody {
	sessionId: string | undefined;
	ip: string;
}
