import {getAuthenticatedSession} from './../../../server/session';
import {changePassword} from './../../../server/user-authentication';

import {NextResponse} from 'next/server';

import type {BasicApiResponse} from './../../types.d';
import type {NextRequest} from 'next/server';

interface RequestBody {
	currentPassword: string;
	password: string;
}

export async function POST(req: NextRequest) {
	const session = getAuthenticatedSession();

	const data = await req.json() as RequestBody;

	const hasChanged = await changePassword(session.user.id, data.currentPassword, data.password);
	return NextResponse.json<BasicApiResponse>({successful: hasChanged});
}
