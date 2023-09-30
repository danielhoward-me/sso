import email, {EmailTemplate} from './../../../server/email';

import {NextResponse} from 'next/server';

export async function GET() {
	email.sendTemplate('Daniel <danielnhoward93@gmail.com>', EmailTemplate.ConfirmEmail, {
		username: 'John',
		expiryTime: 10,
		confirmCode: 'FGI-5P1',
	});
	email.sendTemplate('Daniel <danielnhoward93@gmail.com>', EmailTemplate.ResetPassword, {
		username: 'John',
		expiryTime: 10,
		resetPasswordLink: 'https://sso.danielhoward.me',
	});

	return NextResponse.json({});
}
