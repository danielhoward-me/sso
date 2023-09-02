import {getAuthenticatedSession} from './../../../../server/session';

import {NextResponse} from 'next/server';

import type {BasicApiResponse} from './../../../types.d';
import type {NextRequest} from 'next/server';

interface RequestBody {
	currentPassword: string;
	password: string;
}

export async function POST(req: NextRequest) {
	const {user} = getAuthenticatedSession();

	const data = await req.json() as RequestBody;

	const passwordCorrect = await user.isPasswordCorrect(data.currentPassword);
	const response: BasicApiResponse = {successful: passwordCorrect};

	if (passwordCorrect) {
		user.changePassword(data.password);
	}

	return NextResponse.json(response);
}
