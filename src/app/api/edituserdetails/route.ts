import {userDetailsValidationData} from './../../../inputs';
import db from './../../../server/database';
import {getSession} from './../../../server/session';
import validate from './../../../validate';

import {NextResponse} from 'next/server';

import type {EditUserDetailsApiResponse} from './../../types.d';
import type {NextRequest} from 'next/server';

interface RequestBody {
	username: string;
	email: string;
}

export async function POST(req: NextRequest) {
	const session = getSession();

	if (!session.user) return NextResponse.json({error: 'Unauthorised'}, {status: 401});

	const body = await req.json();
	const validationData = validate(userDetailsValidationData, body);
	if (Object.keys(validationData).length > 0) return NextResponse.json({error: validationData}, {status: 400});

	const data = body as RequestBody;

	let response: EditUserDetailsApiResponse = {detailsChanged: true};

	if (await db.fieldExists('users', 'username', data.username, [{name: 'id', value: session.user.id, negate: true}])) {
		response = {
			...response,
			detailsChanged: false,
			usernameExists: true,
		};
	}
	if (await db.fieldExists('users', 'email', data.email, [{name: 'id', value: session.user.id, negate: true}])) {
		response = {
			...response,
			detailsChanged: false,
			emailExists: true,
		};
	}

	if (!response.detailsChanged) return NextResponse.json<EditUserDetailsApiResponse>(response);

	await db.editUserDetails(session.user.id, data.username, data.email);

	return NextResponse.json<EditUserDetailsApiResponse>({detailsChanged: true});
}
