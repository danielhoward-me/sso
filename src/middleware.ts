import {hideNavbarPages} from './constants';
import {loadSession} from './server/session/sessionApi';
import {validateApiRequest} from './validate-api-request';

import {NextResponse} from 'next/server';

import type {NextRequest} from 'next/server';

export async function middleware(req: NextRequest) {
	const res = await loadSession(req) || await validateApiRequest(req);
	if (res) return res;

	const hideNavbar = hideNavbarPages.includes(req.nextUrl.pathname) || (
		req.nextUrl.searchParams.has('hidenavbar') && (
			([
				'/login', '/signup',
			]).includes(req.nextUrl.pathname)
		)
	);
	const headers = new Headers(req.headers);
	if (hideNavbar) headers.set('x-hide-navbar', '1');

	return NextResponse.next({
		request: {headers},
	});
}
