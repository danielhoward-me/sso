import {getSession} from './../../server/session';
import MiddleIsland from './../components/middleIsland';
import UserDetails from './../components/userDetails';
import {getRedirectQueryForPage} from './../utils/getRedirect';
import getUserDetailsValues from './../utils/getUserDetailsValues';

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
		<MiddleIsland>
			<h1 className="text-6xl font-bold pb-2">View Your Account</h1>
			<UserDetails user={getUserDetailsValues(session.user)}/>
		</MiddleIsland>
	);
}
