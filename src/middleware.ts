import {loadSession} from './server/session/sessionApi';
import {validateApiRequest} from './validate-api-request';

import {NextResponse} from 'next/server';

import type {NextRequest} from 'next/server';

export async function middleware(req: NextRequest) {
	const sessionRes = await loadSession(req);
	if (sessionRes) return sessionRes;

	const validateApiRequestRes = await validateApiRequest(req);
	if (validateApiRequestRes) return validateApiRequestRes;

	return NextResponse.next();
}
