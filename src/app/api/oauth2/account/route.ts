import {getAccessTokenData} from './../../../../server/oauth2';

import {NextResponse} from 'next/server';
import {validate} from 'uuid';

import type {NextRequest} from 'next/server';

export async function GET(req: NextRequest) {
	const authentication = req.headers.get('Authorization') ?? '';
	const token = authentication.replace(/^Bearer /, '');

	if (!validate(token)) return NextResponse.json({error: 'Invalid Access Token'}, {status: 400});

	const tokenData = await getAccessTokenData(token);
	if (!tokenData) {
		return NextResponse.json({error: 'Incorrect Access Token'}, {status: 401});
	}

	return NextResponse.json({
		userId: tokenData.user.id,
		username: tokenData.user.username,
		email: tokenData.user.email,
		profilePicture: tokenData.user.getProfilePictureUrl(),
		admin: tokenData.user.admin,
	});
}
