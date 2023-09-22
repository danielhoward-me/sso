import {ACCESS_TOKEN_EXPIRES_SECONDS} from './../constants';
import db from './database';

import {v4 as uuid} from 'uuid';

import type User from './user';

export default async function getAccessToken(target: string, user: User): Promise<string> {
	let token = '';
	while (token === '' || await db.entryExists('access_tokens', {field: 'token', value: token})) {
		token = uuid();
	}

	await db.createAccessToken(token, user.id, target, ACCESS_TOKEN_EXPIRES_SECONDS);

	return new URLSearchParams({
		access_token: token,
		expires_in: ACCESS_TOKEN_EXPIRES_SECONDS.toString(),
	}).toString();
}
