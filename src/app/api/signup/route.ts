import db from './../../../server/database';
import {createUser} from './../../../server/user-authentication';

import {NextResponse} from 'next/server';
import {v4 as uuid} from 'uuid';

import type {AccountDetailsApiResponse} from './../../types.d';
import type {NextRequest} from 'next/server';

interface RequestBody {
	username: string;
	email: string;
	password: string;
	confirmPassword: string;
}

export async function POST(req: NextRequest) {
	const data = await req.json() as RequestBody;

	let response: AccountDetailsApiResponse = {successful: true};

	if (await db.fieldExists('users', 'username', data.username)) {
		response = {
			...response,
			successful: false,
			usernameExists: true,
		};
	}
	if (await db.fieldExists('users', 'email', data.email)) {
		response = {
			...response,
			successful: false,
			emailExists: true,
		};
	}

	if (response.successful) {
		let id = '';
		while (id === '' || await db.fieldExists('users', 'id', id)) {
			id = uuid();
		}

		await createUser(id, data.username, data.email, data.password);
	}

	return NextResponse.json(response);
}
