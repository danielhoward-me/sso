import User from './../../../server/user';

import {NextResponse} from 'next/server';

import type {BasicApiResponse} from './../../types.d';
import type {NextRequest} from 'next/server';

interface RequestBody {
	email: string;
}

export async function POST(req: NextRequest) {
	const data = await req.json() as RequestBody;

	await User.sendPasswordResetEmail(data.email);

	return NextResponse.json<BasicApiResponse>({
		successful: true,
	});
}
