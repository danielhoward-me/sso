import {getSession} from './../../server/session';
import {getRedirectQueryForPage} from './../utils/get-redirect';
import getUserDetailsValues from './../utils/get-user-details-values';
import AccountEditor from './account-editor';

import {redirect} from 'next/navigation';

import type {Metadata} from 'next';

export const metadata: Metadata = {
	title: 'View You Account',
	description: 'View Your Account to access and save your data across all of my services',
};

export default function AccountPage() {
	const session = getSession();

	if (!session.user) {
		redirect(`/login${getRedirectQueryForPage('/account')}`);
	}

	return (
		<AccountEditor user={getUserDetailsValues(session.user)}/>
	);
}
