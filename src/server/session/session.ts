import {setSession, getSessionId} from './';
import {SESSION_COOKIE_MAX_AGE} from './../../constants';
import db from './../database';
import User from './../user';

import {v4 as uuid} from 'uuid';

import type {RawSession, Session} from './../types.d';

// Called from the session API to load a session into the cache
export async function loadSessionFromApi(
	sessionId: string | undefined,
	ip: string
): Promise<RawSession> {
	const rawSession = (
		await loadSessionFromId(sessionId, ip)
	) ?? (
		await createSession(ip)
	);

	const session = await processSession(rawSession);
	setSession(rawSession.id, session);

	return rawSession;
}

async function loadSessionFromId(
	sessionId: string | undefined,
	ip: string
): Promise<RawSession | null> {
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

async function createSession(ip: string): Promise<RawSession> {
	let id = '';
	while (id === '' || await db.entryExists('sessions', {field: 'id', value: id})) {
		id = uuid();
	}

	await db.createSession(id, ip, SESSION_COOKIE_MAX_AGE);

	return {
		id,
		ip,
		expires: SESSION_COOKIE_MAX_AGE.toString(),
		user_id: null,
		wait_for_auth_user_id: null,
	};
}

async function processSession(rawSession?: RawSession): Promise<Session> {
	const user = rawSession?.user_id ? await User.get(rawSession.user_id) : null;
	const waitForAuthUser = rawSession?.wait_for_auth_user_id ? await User.get(rawSession.wait_for_auth_user_id) : null;

	return {
		user,
		waitForAuthUser,
	};
}

export async function saveSession(userId: string | null, waitForAuthUserId: string | null = null): Promise<void> {
	const sessionId = getSessionId();
	await db.updateSession(sessionId, userId, waitForAuthUserId);
}
