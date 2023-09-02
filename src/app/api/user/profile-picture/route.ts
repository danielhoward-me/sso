import {getAuthenticatedSession} from './../../../../server/session';

import {NextResponse} from 'next/server';

import type {ProfilePictureType} from '././../../../../constants';
import type {BasicApiResponse} from './../../../types.d';
import type {NextRequest} from 'next/server';

interface RequestBody {
	profilePicture: ProfilePictureType;
}

export async function POST(req: NextRequest) {
	const {user} = getAuthenticatedSession();

	const data = await req.json() as RequestBody;

	await user.changeProfilePicture(data.profilePicture);

	return NextResponse.json<BasicApiResponse>({successful: true});
}
