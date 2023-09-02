import {saveSession} from './../../../server/session/session';
import User from './../../../server/user';

import {NextResponse} from 'next/server';

import type {AccountDetailsApiResponse} from './../../types.d';
import type {NextRequest} from 'next/server';

interface RequestBody {
	username: string;
	email: string;
	password: string;
}

export async function POST(req: NextRequest) {
	const data = await req.json() as RequestBody;

	let response: AccountDetailsApiResponse = {successful: true};

	if (await User.usernameExists(data.username)) {
		response = {
			...response,
			successful: false,
			usernameExists: true,
		};
	}
	if (await User.emailExists(data.email)) {
		response = {
			...response,
			successful: false,
			emailExists: true,
		};
	}

	if (response.successful) {
		const user = await User.create(data.username, data.email, data.password);
		saveSession(user.id);
	}

	return NextResponse.json(response);
}
