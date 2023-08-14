import {loadSession} from './server/sessionApi';

import type {NextRequest} from 'next/server';

export async function middleware(req: NextRequest) {
	return await loadSession(req);
}
