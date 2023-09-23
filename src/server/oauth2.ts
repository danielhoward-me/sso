import {ACCESS_TOKEN_EXPIRES_SECONDS} from './../constants';
import db from './database';
import User from './user';

import {v4 as uuid} from 'uuid';

import type {AccessTokenData} from './types.d';

export async function makeAccessToken(target: string, user: User): Promise<string> {
	let token = '';

	const currentToken = await db.getAccessToken(user.id, target);
	if (currentToken) {
		await db.updateAccessTokenExpiry(currentToken, ACCESS_TOKEN_EXPIRES_SECONDS);
		token = currentToken;
	} else {
		while (token === '' || await db.entryExists('access_tokens', {field: 'token', value: token})) {
			token = uuid();
		}

		await db.createAccessToken(token, user.id, target, ACCESS_TOKEN_EXPIRES_SECONDS);
	}

	return new URLSearchParams({
		access_token: token,
		expires_in: ACCESS_TOKEN_EXPIRES_SECONDS.toString(),
	}).toString();
}

export async function getAccessTokenData(token: string): Promise<AccessTokenData | null> {
	const tokenData = await db.getAccessTokenData(token);
	if (!tokenData) return null;

	const expires = new Date(tokenData.expires);
	if (expires.getTime() < Date.now()) {
		db.deleteAccessToken(token);
		return null;
	}

	const user = new User(tokenData.user_id);
	await user.waitForLoad();

	return {
		user,
		target: tokenData.target,
		expires: new Date(tokenData.expires),
	};
}
