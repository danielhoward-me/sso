import {CookieName} from './constants';
import {apiValidationDataMap} from './inputs';
import {sessionHasUser} from './server/session';
import validate from './validate';

import {NextResponse} from 'next/server';

import type {NextRequest} from 'next/server';

const apiRequestRegex = new RegExp(`^/api/(${Object.keys(apiValidationDataMap).join('|')})$`);

export async function validateApiRequest(req: NextRequest): Promise<NextResponse | void> {
	const apiRoute = req.nextUrl.pathname.match(apiRequestRegex)?.[1];
	if (!apiRoute) return;

	const {validationData, requiresAccount, requiresBearerToken} = apiValidationDataMap[apiRoute];

	if (requiresAccount && !sessionHasUser(req.cookies.get(CookieName.SESSION)?.value ?? '')) {
		return NextResponse.json({error: 'Unauthorised'}, {status: 401});
	}

	if (requiresBearerToken) {
		const authentication = req.headers.get('authorization') ?? '';
		const bearerToken = authentication.replace(/^Bearer /, '');

		if (bearerToken !== requiresBearerToken()) return NextResponse.json({error: 'Unauthorised'}, {status: 401});
	}

	try {
		const body = await req.json();
		const validationErrors = validate(validationData, body);
		if (Object.keys(validationErrors).length > 0) return NextResponse.json({error: validationErrors}, {status: 400});
	} catch (err) {
		return NextResponse.json({error: 'Invalid JSON'}, {status: 400});
	}
}
