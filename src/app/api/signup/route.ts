import {signupPageValidationData} from './../../../inputs';
import db from './../../../server/database';
import {createUser} from './../../../server/user-authentication';
import validate from './../../../validate';

import {NextResponse} from 'next/server';
import {v4 as uuid} from 'uuid';

import type {SignupApiResponse} from './../../types.d';
import type {NextRequest} from 'next/server';

interface RequestBody {
	username: string;
	email: string;
	password: string;
	confirmPassword: string;
}

export async function POST(req: NextRequest) {
	const body = await req.json();
	const validationData = validate(signupPageValidationData, body);
	if (Object.keys(validationData).length > 0) return NextResponse.json({error: validationData}, {status: 400});

	const data = body as RequestBody;

	let response: SignupApiResponse = {accountCreated: true};

	if (await db.fieldExists('users', 'username', data.username)) {
		response = {
			...response,
			accountCreated: false,
			usernameExists: true,
		};
	}
	if (await db.fieldExists('users', 'email', data.email)) {
		response = {
			...response,
			accountCreated: false,
			emailExists: true,
		};
	}

	if (!response.accountCreated) return NextResponse.json<SignupApiResponse>(response);

	let id = '';
	while (id === '' || await db.fieldExists('users', 'id', id)) {
		id = uuid();
	}

	await createUser(id, data.username, data.email, data.password);

	return NextResponse.json<SignupApiResponse>({accountCreated: true});
}
