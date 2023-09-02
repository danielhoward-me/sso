import {saveSession} from './../../../server/session/session';
import User from './../../../server/user';

import {NextResponse} from 'next/server';

import type {BasicApiResponse} from './../../types.d';
import type {NextRequest} from 'next/server';

interface RequestBody {
	email: string;
	password: string;
}

export async function POST(req: NextRequest) {
	const data = await req.json() as RequestBody;
	const user = await User.get(data.email, data.password);
	if (user) saveSession(user.id);

	return NextResponse.json<BasicApiResponse>({successful: user !== null});
}
