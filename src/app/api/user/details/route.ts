import {getAuthenticatedSession} from './../../../../server/session';

import {NextResponse} from 'next/server';

import type {AccountDetailsApiResponse} from './../../../types.d';
import type {NextRequest} from 'next/server';

interface RequestBody {
	username: string;
	email: string;
}

export async function POST(req: NextRequest) {
	const {user} = getAuthenticatedSession();

	const data = await req.json() as RequestBody;

	let response: AccountDetailsApiResponse = {successful: true};

	if (await user.usernameAvailable(data.username)) {
		response = {
			...response,
			successful: false,
			usernameExists: true,
		};
	}
	if (await user.emailAvailable(data.email)) {
		response = {
			...response,
			successful: false,
			emailExists: true,
		};
	}

	if (response.successful) await user.editDetails(data.username, data.email);

	return NextResponse.json(response);
}
