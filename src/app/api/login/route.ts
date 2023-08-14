import {loginPageValidationData} from './../../../inputs';
import {loginUser} from './../../../server/user-authentication';
import validate from './../../../validate';

import {NextResponse} from 'next/server';

import type {NextRequest} from 'next/server';

interface RequestBody {
	email: string;
	password: string;
}

export async function POST(req: NextRequest) {
	const body = await req.json();
	const validationData = validate(loginPageValidationData, body);
	if (Object.keys(validationData).length > 0) return NextResponse.json({error: validationData}, {status: 400});

	const data = body as RequestBody;
	const isCorrect = await loginUser(data.email, data.password);

	return NextResponse.json({successful: isCorrect});
}
