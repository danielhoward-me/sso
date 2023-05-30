import {sessionCookieName, sessionCookieMaxAge} from './../constants/session';
import db from './database';

import {serialize} from 'cookie';
import {v4 as uuid} from 'uuid';

import type {Session} from './../constants/session';
import type {GetServerSidePropsContext} from 'next';

export default async function getSession(
	req: GetServerSidePropsContext['req'],
	res: GetServerSidePropsContext['res']
): Promise<Session> {
	const sessionId = req.cookies[sessionCookieName];
	if (!sessionId) return await createSession(req, res);

	const session = await db.getSession(sessionId);
	if (!session) return await createSession(req, res);

	const now = new Date();
	const expires = new Date(session.expires);
	if (now > expires) {
		await db.deleteSession(sessionId);
		return await createSession(req, res);
	}

	const ip = getRequestIp(req);
	if (session.ip !== ip) {
		return await createSession(req, res);
	}

	return {
		user: session.user_id ? {id: session.user_id} : null,
	};
}

async function createSession(
	req: GetServerSidePropsContext['req'],
	res: GetServerSidePropsContext['res']
): Promise<Session> {
	const id = uuid();
	const ip = getRequestIp(req);
	await db.createSession(id, ip, sessionCookieMaxAge);

	const cookie = serialize(sessionCookieName, id, {
		maxAge: sessionCookieMaxAge,
	});
	res.setHeader('Set-Cookie', cookie);

	return {user: null};
}

function getRequestIp(req: GetServerSidePropsContext['req']): string {
	const forwardedFor = req.headers['x-forwarded-for'];
	if (typeof forwardedFor === 'string') return forwardedFor;

	const remoteAddress = req.socket.remoteAddress;
	if (typeof remoteAddress === 'string') return remoteAddress;

	return '';
}
