import {saveSession} from './../../server/session/session';

import {headers} from 'next/headers';
import {NextResponse} from 'next/server';

import type {NextRequest} from 'next/server';

export function GET(req: NextRequest) {
	saveSession(null);
	const referer = headers().get('Referer');
	return NextResponse.redirect(referer || req.nextUrl.origin);
}
