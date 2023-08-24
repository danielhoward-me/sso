import {loginUser} from './../../../server/user-authentication';

import {NextResponse} from 'next/server';

import type {BasicApiResponse} from './../../types.d';
import type {NextRequest} from 'next/server';

interface RequestBody {
	email: string;
	password: string;
}

export async function POST(req: NextRequest) {
	const data = await req.json() as RequestBody;
	const isCorrect = await loginUser(data.email, data.password);

	return NextResponse.json<BasicApiResponse>({successful: isCorrect});
}
