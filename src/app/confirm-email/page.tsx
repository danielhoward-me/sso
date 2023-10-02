import {getSession} from './../../server/session';
import MiddleIsland from './../components/middle-island';
import {getRedirect} from './../utils/get-redirect';
import ConfirmEmailForm from './form';

import {redirect} from 'next/navigation';

import type {SearchParamsProps} from './../types.d';

export default function EmailAuthPage({searchParams}: SearchParamsProps) {
	const session = getSession();

	const redirectPath = getRedirect(searchParams, '/confirm-email');

	if (session.waitForAuthUser === null) {
		redirect(redirectPath);
	} else if (Date.now() > session.waitForAuthUser.authCodeExpires.getTime()) {
		session.waitForAuthUser.generateAuthCode();
	}

	return (
		<MiddleIsland>
			<h1 className="text-6xl font-bold pb-2">Confirm your email</h1>
			<ConfirmEmailForm email={session.waitForAuthUser.email} redirect={redirectPath}/>
		</MiddleIsland>
	);
}
