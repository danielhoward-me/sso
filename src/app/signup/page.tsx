import {getSession} from './../../server/session';
import Link from './../components/link';
import MiddleIsland from './../components/middle-island';
import {getRedirect, getRedirectQueryForPage} from './../utils/get-redirect';
import SignupForm from './form';

import {redirect} from 'next/navigation';

import type {SearchParamsProps} from './../types.d';
import type {Metadata} from 'next';

export const metadata: Metadata = {
	title: 'Create an Account',
	description: 'Create an Account to access and save your data across all of my services',
};

export default function SignupPage({searchParams}: SearchParamsProps) {
	const session = getSession();

	const redirectPath = getRedirect(searchParams, '/signup');

	if (session.user) {
		redirect(redirectPath);
	}

	return (
		<MiddleIsland>
			<h1 className="text-6xl font-bold pb-2">Sign up for Your Account</h1>
			<SignupForm redirect={redirectPath}/>
			<div className="block mt-5 leading-snug">
				Already have an account?
				<br/>
				<Link href={`/login${getRedirectQueryForPage(redirectPath)}${searchParams.hidenavbar === undefined ? '' : '&hidenavbar'}`}>
					Login here
				</Link>
			</div>
		</MiddleIsland>
	);
}
