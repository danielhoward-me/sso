import {loadSessionFromApi} from './../../../server/session/session';

import {NextResponse} from 'next/server';

import type {SessionApiRequestBody} from './../../../server/types.d';
import type {NextRequest} from 'next/server';

export async function POST(req: NextRequest) {
	const data = await req.json() as SessionApiRequestBody;
	const session = await loadSessionFromApi(data.sessionId, data.ip);
	return NextResponse.json(session);
}
