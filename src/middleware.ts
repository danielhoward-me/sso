import {loadSession} from './server/sessionApi';

import {NextResponse} from 'next/server';

import type {NextRequest} from 'next/server';

export async function middleware(req: NextRequest) {
	const res = NextResponse.next();
	await loadSession(req, res);
	return NextResponse.next(res);
}
