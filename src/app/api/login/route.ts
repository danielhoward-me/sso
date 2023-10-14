import {saveSession} from './../../../server/session/session';
import User from './../../../server/user';

import {NextResponse} from 'next/server';

import type {LoginApiResponse} from './../../types.d';
import type {NextRequest} from 'next/server';

interface RequestBody {
	email: string;
	password: string;
}

export async function POST(req: NextRequest) {
	const data = await req.json() as RequestBody;
	const user = await User.checkCredentials(data.email, data.password);

	let response: LoginApiResponse = {
		successful: true,
	};

	if (user && !user.authCode) {
		saveSession(user.id);
	} else if (user && user.authCode) {
		saveSession(null, user.id);

		response = {
			successful: false,
			requiresEmailAuth: true,
		};
	} else {
		response = {
			successful: false,
		};
	}

	return NextResponse.json(response);
}
