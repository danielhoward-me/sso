import {SESSION_COOKIE_MAX_AGE, SESSION_COOKIE_NAME} from './constants';
import db from './database';
import User from './user';

import {cookies as getCookies, headers as getHeaders} from 'next/headers';
import {v4 as uuid} from 'uuid';

import type {RawSession, Session} from './types.d';
import type {ReadonlyRequestCookies} from 'next/dist/server/web/spec-extension/adapters/request-cookies';

const sessionCache: {[uuid: string]: Session} = {};
const defaultSession = processSession();

export async function loadSession() {
	const ip = getHeaders().get('x-forwarded-for') ?? '';
	const cookies = getCookies();

	const rawSession = (
		await loadSessionFromRequest(cookies, ip)
	) ?? (
		await createSession(cookies, ip)
	);

	const session = processSession(rawSession);
	sessionCache[rawSession.id] = session;
}

async function loadSessionFromRequest(
	cookies: ReadonlyRequestCookies,
	ip: string
): Promise<RawSession | null> {
	const sessionId = cookies.get(SESSION_COOKIE_NAME)?.value;
	if (!sessionId) return null;

	const session = await db.getSession(sessionId);
	if (!session) return null;

	const now = new Date();
	const expires = new Date(session.expires);
	if (now > expires) {
		await db.deleteSession(sessionId);
		return null;
	}

	if (session.ip !== ip) {
		return null;
	}

	return session;
}

async function createSession(
	cookies: ReadonlyRequestCookies,
	ip: string
): Promise<RawSession> {
	const id = uuid();
	await db.createSession(id, ip, SESSION_COOKIE_MAX_AGE);

	// cookies.set(SESSION_COOKIE_NAME, id, {
	// 	maxAge: SESSION_COOKIE_MAX_AGE,
	// });

	return {
		id,
		ip,
		expires: SESSION_COOKIE_MAX_AGE.toString(),
		user_id: null,
	};
}

function processSession(rawSession?: RawSession): Session {
	return {
		user: rawSession?.user_id ? new User(rawSession.user_id) : null,
	};
}

export function getSession(): Session {
	const cookies = getCookies();
	const sessionId = cookies.get(SESSION_COOKIE_NAME)?.value;
	if (!sessionId) return defaultSession;

	return sessionCache[sessionId] ?? defaultSession;
}
