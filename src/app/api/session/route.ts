import {loadSessionFromApi} from './../../../server/session';

import {NextResponse} from 'next/server';

import type {SessionApiRequestBody} from './../../../server/types.d';
import type {NextRequest} from 'next/server';

export async function POST(req: NextRequest) {
	const authentication = req.headers.get('authorization') ?? '';
	const apiKey = authentication.replace(/^Bearer /, '');

	// Don't make any indication that this endpoint exists
	// as it's only used internally
	if (apiKey !== process.env.SESSION_API_KEY) return NextResponse.json({error: 'Unauthorized'}, {status: 401});

	const partialBody = await req.json() as Partial<SessionApiRequestBody>;

	let body: SessionApiRequestBody;
	try {
		body = validateBody(partialBody);
	} catch (err) {
		return NextResponse.json({error: err.message}, {status: 400});
	}

	const session = await loadSessionFromApi(body.sessionId, body.ip);
	return NextResponse.json(session);
}

function validateBody(body: Partial<SessionApiRequestBody>): SessionApiRequestBody {
	if (body.ip === undefined) {
		throw new Error('IP is required');
	}

	return body as SessionApiRequestBody;
}
