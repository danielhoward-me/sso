import authTargets from './../../../auth-targets';
import getAccessToken from './../../../server/oauth2';
import {getAuthenticatedSession} from './../../../server/session';

import {NextResponse} from 'next/server';

import type {AuthApiResponse} from './../../types.d';
import type {NextRequest} from 'next/server';

interface RequestBody {
	target: string;
	devPort?: string;
}

export async function POST(req: NextRequest) {
	const data = await req.json() as RequestBody;
	const session = getAuthenticatedSession();

	let urlSuffix = '';

	const target = authTargets[data.target];
	switch (target.tokenType) {
	case 'token': {
		const params = await getAccessToken(data.target, session.user);
		urlSuffix = `#${params}`;
	}
	}

	if (urlSuffix === '') throw new Error('No urlSuffix has been set');

	const redirect = `${data.devPort ? `http://local.danielhoward.me:${data.devPort}` : `https://${target.hostname}`}/${target.path}${urlSuffix}`;
	return NextResponse.json<AuthApiResponse>({redirect});
}
