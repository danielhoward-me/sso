import {loadSession} from './server/sessionApi';

import {NextResponse} from 'next/server';

import type {NextRequest} from 'next/server';

export async function middleware(req: NextRequest) {
	const res = NextResponse.next();
	await loadSession(req, res);

	// Request the prefered colour scheme to be added to the response
	res.headers.append('Accept-CH', 'Sec-CH-Prefers-Color-Scheme');
	res.headers.append('Vary', 'Sec-CH-Prefers-Color-Scheme');
	res.headers.append('Critical-CH', 'Sec-CH-Prefers-Color-Scheme');

	return NextResponse.next(res);
}
