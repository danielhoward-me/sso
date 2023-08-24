import db from './../../../server/database';
import {getAuthenticatedSession} from './../../../server/session';

import {NextResponse} from 'next/server';

import type {AccountDetailsApiResponse} from './../../types.d';
import type {NextRequest} from 'next/server';

interface RequestBody {
	username: string;
	email: string;
}

export async function POST(req: NextRequest) {
	const session = getAuthenticatedSession();

	const data = await req.json() as RequestBody;

	let response: AccountDetailsApiResponse = {successful: true};

	if (await db.fieldExists('users', 'username', data.username, [{name: 'id', value: session.user.id, negate: true}])) {
		response = {
			...response,
			successful: false,
			usernameExists: true,
		};
	}
	if (await db.fieldExists('users', 'email', data.email, [{name: 'id', value: session.user.id, negate: true}])) {
		response = {
			...response,
			successful: false,
			emailExists: true,
		};
	}

	if (response.successful) await db.editUserDetails(session.user.id, data.username, data.email);

	return NextResponse.json(response);
}
