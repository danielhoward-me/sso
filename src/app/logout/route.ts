import {saveSession} from './../../server/session';

import {headers as getHeaders} from 'next/headers';
import {NextResponse} from 'next/server';

export function GET() {
	saveSession('');
	const headers = getHeaders();
	return NextResponse.redirect(headers.get('Referer') || '/');
}
