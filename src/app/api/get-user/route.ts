import {getAccessTokenData} from './../../../server/oauth2';
import User from './../../../server/user';

import {NextResponse} from 'next/server';
import {validate} from 'uuid';

import type {BasicApiResponse} from './../../types.d';
import type {NextRequest} from 'next/server';

interface RequestBody {
	id: string;
	username: string;
}

export async function POST(req: NextRequest) {
	const authentication = req.headers.get('Authorization') ?? '';
	const token = authentication.replace(/^Bearer /, '');

	if (!validate(token)) return NextResponse.json({error: 'Invalid Access Token'}, {status: 400});

	const tokenData = await getAccessTokenData(token);
	if (!tokenData) {
		return NextResponse.json({error: 'Incorrect Access Token'}, {status: 401});
	}

	if (!tokenData.user.admin) {
		return NextResponse.json({error: 'Unauthorised'}, {status: 403});
	}

	const data = await req.json() as RequestBody;

	let id: string;

	if (data.id) {
		const exists = await User.idExists(data.id);
		if (!exists) {
			return NextResponse.json<BasicApiResponse>({successful: false});
		}
		id = data.id;
	} else if (data.username) {
		const exists = await User.usernameExists(data.username);
		if (!exists) {
			return NextResponse.json<BasicApiResponse>({successful: false});
		}

		id = await User.getIdFromUsername(data.username);
	} else {
		return NextResponse.json({error: 'Please provide id or username'}, {status: 400});
	}

	const user = await User.get(id);

	return NextResponse.json({
		successful: true,
		id: user.id,
		username: user.username,
		profilePicture: user.getProfilePictureUrl(),
	});
}
