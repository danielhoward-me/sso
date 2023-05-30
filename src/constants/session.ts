import type {User} from './user';

export interface RawSession {
	id: string;
	ip: string;
	expires: string;
	user_id: string;
}

export interface Session {
	user: User | null;
}

export const sessionCookieName = 'session';
export const sessionCookieMaxAge = 60 * 60 * 24 * 30; // 30 days
