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

// Should match schema.sql profile_picture
export enum ProfilePictureType {
	Custom = 'custom',
	Identicon = 'identicon',
	MonsterId = 'monsterid',
	Wavatar = 'wavatar',
	Retro = 'retro',
	Robohash = 'robohash',
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
