import {sessionApiValidationData} from './../../../inputs';
import {loadSessionFromApi} from './../../../server/session';
import validate from './../../../validate';

import {NextResponse} from 'next/server';

import type {SessionApiRequestBody} from './../../../server/types.d';
import type {NextRequest} from 'next/server';


export async function POST(req: NextRequest) {
	const authentication = req.headers.get('authorization') ?? '';
	const apiKey = authentication.replace(/^Bearer /, '');

	if (apiKey !== process.env.SESSION_API_KEY) return NextResponse.json({error: 'Unauthorized'}, {status: 401});

	const body = await req.json();
	const validationData = validate(sessionApiValidationData, body);
	if (Object.keys(validationData).length > 0) return NextResponse.json({error: validationData}, {status: 400});

	const data = body as SessionApiRequestBody;
	const session = await loadSessionFromApi(data.sessionId, data.ip);
	return NextResponse.json(session);
}
