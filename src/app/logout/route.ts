import {saveSession} from './../../server/session';

import {headers as getHeaders} from 'next/headers';
import {NextResponse} from 'next/server';

import type {NextRequest} from 'next/server';

export function GET(req: NextRequest) {
	saveSession(null);
	const headers = getHeaders();
	return NextResponse.redirect(headers.get('Referer') || req.nextUrl.origin);
}
