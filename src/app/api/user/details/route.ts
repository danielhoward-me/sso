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

	const usernameExists = await user.newUsernameExists(data.username);
	const emailExists = await user.newEmailExists(data.email);

	if (usernameExists || emailExists) {
		return NextResponse.json<AccountDetailsApiResponse>({
			successful: false,
			usernameExists,
			emailExists,
		});
	}

	await user.editDetails(data.username, data.email);

	return NextResponse.json<AccountDetailsApiResponse>({successful: true});
}
