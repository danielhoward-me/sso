import {loginUser} from './../../../server/user-authentication';

import {NextResponse} from 'next/server';

import type {NextRequest} from 'next/server';

interface RequestBody {
	email: string;
	password: string;
}

export async function POST(req: NextRequest) {
	const partialBody = await req.json() as Partial<RequestBody>;

	let body: RequestBody;
	try {
		body = validateBody(partialBody);
	} catch (err) {
		return NextResponse.json({error: err.message}, {status: 400});
	}

	const isCorrect = await loginUser(body.email, body.password);

	return NextResponse.json({successful: isCorrect});
}

function validateBody(body: Partial<RequestBody>): RequestBody {
	if (body.email === undefined) {
		throw new Error('Email is required');
	}

	if (body.password === undefined) {
		throw new Error('Password is required');
	}

	return body as RequestBody;
}
