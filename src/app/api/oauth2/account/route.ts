import {getAccessTokenData} from './../../../../server/oauth2';

import {NextResponse} from 'next/server';

import type {NextRequest} from 'next/server';

export async function GET(req: NextRequest) {
	const authentication = req.headers.get('authorization') ?? '';
	const token = authentication.replace(/^Bearer /, '');

	const tokenData = await getAccessTokenData(token);
	if (!tokenData) {
		return NextResponse.json({error: 'Invalid Access Token'}, {status: 403});
	}

	return NextResponse.json({
		userId: tokenData.user.id,
		username: tokenData.user.username,
		email: tokenData.user.email,
		profilePicture: tokenData.user.getProfilePictureUrl(),
	});
}
