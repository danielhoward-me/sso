import {getAccessTokenData} from './../../../server/oauth2';
import User from './../../../server/user';

import {NextResponse} from 'next/server';
import {validate} from 'uuid';

import type {BasicApiResponse} from './../../types.d';
import type {NextRequest} from 'next/server';

interface RequestBody {
	id: string;
}

export async function POST(req: NextRequest) {
	const authentication = req.headers.get('Authorization') ?? '';
	const token = authentication.replace(/^Bearer /, '');

	if (!validate(token)) return NextResponse.json({error: 'Invalid Access Token'}, {status: 400});

	const tokenData = await getAccessTokenData(token);
	if (!tokenData) {
		return NextResponse.json({error: 'Incorrect Access Token'}, {status: 401});
	}

	const data = await req.json() as RequestBody;

	const exists = await User.idExists(data.id);
	if (!exists) {
		return NextResponse.json<BasicApiResponse>({successful: false});
	}

	const user = await User.get(data.id);

	return NextResponse.json({
		successful: true,
		username: user.username,
		profilePicture: user.getProfilePictureUrl(),
	});
}
