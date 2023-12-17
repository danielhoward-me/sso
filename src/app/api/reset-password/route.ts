import User from './../../../server/user';

import {NextResponse} from 'next/server';

import type {BasicApiResponse} from './../../types.d';
import type {NextRequest} from 'next/server';

interface RequestBody {
	token: string;
	password: string;
}

export async function POST(req: NextRequest) {
	const data = await req.json() as RequestBody;

	const user = await User.getUserWithPasswordResetToken(data.token);
	if (!user) {
		return NextResponse.json<BasicApiResponse>({
			successful: false,
		}, {status: 401});
	}

	await user.changePassword(data.password);

	return NextResponse.json<BasicApiResponse>({
		successful: true,
	});
}
