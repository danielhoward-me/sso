import {getSession} from './../../../server/session';
import {saveSession} from './../../../server/session/session';

import {NextResponse} from 'next/server';

import type {BasicApiResponse} from './../../types.d';
import type {NextRequest} from 'next/server';

interface RequestBody {
	authCode: string;
}

export async function POST(req: NextRequest) {
	const session = getSession();
	if (!session.waitForAuthUser) return NextResponse.json({error: 'Not waiting for email code'}, {status: 403});

	const data = await req.json() as RequestBody;

	let response: BasicApiResponse = {
		successful: true,
	};

	if (await session.waitForAuthUser.isCorrectAuthCode(data.authCode)) {
		saveSession(session.waitForAuthUser.id, null);
	} else {
		response = {successful: false};
	}


	return NextResponse.json(response);
}
