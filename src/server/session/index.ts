import {CookieName} from './../../constants';

import {cookies as getCookies} from 'next/headers';

import type {Session} from './../types.d';

// Populated in the main runtime
const sessionCache: {[uuid: string]: Session} = {};
// Populated in the edge runtime for middlware
const sessionHasUserCache: {[uuid: string]: boolean} = {};
const defaultSession: Session = {
	user: null,
};

export function setSession(uuid: string, session: Session) {
	sessionCache[uuid] = session;
}
export function setSessionHasUser(uuid: string, hasUser: boolean) {
	sessionHasUserCache[uuid] = hasUser;
}

export function getSession(): Session {
	return getSessionFromId(getSessionId());
}
export function getSessionFromId(sessionId: string | undefined): Session {
	return sessionCache[sessionId ?? ''] ?? defaultSession;
}
// Only to be used when the session is guaranteed to have a user
export function getAuthenticatedSession(): Session<never> {
	const session = getSession();
	if (!session.user) {
		throw new Error('getAuthenticatedSession should only be used when the session is guaranteed to have a user');
	}
	return session as Session<never>;
}
export function getSessionId(): string {
	const cookies = getCookies();
	return cookies.get(CookieName.SESSION)?.value ?? '';
}

export function sessionHasUser(sessionId: string): boolean {
	return sessionHasUserCache[sessionId];
}
