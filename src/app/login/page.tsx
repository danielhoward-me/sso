import {getSession} from './../../server/session';
import Link from './../components/link';
import MiddleIsland from './../components/middleIsland';
import {getRedirect, getRedirectQueryForPage} from './../utils/get-redirect';
import LoginForm from './form';

import {redirect} from 'next/navigation';

import type {SearchParamsProps} from './../types.d';
import type {Metadata} from 'next';

export const metadata: Metadata = {
	title: 'Log in to Your Account',
	description: 'Log in to your account to access and save your data across all of my services',
};

export default function LoginPage({searchParams}: SearchParamsProps) {
	const session = getSession();

	const redirectPath = getRedirect(searchParams, '/login');

	if (session.user) {
		redirect(redirectPath);
	}

	return (
		<MiddleIsland>
			<h1 className="text-6xl font-bold pb-2">Log in to Your Account</h1>
			<LoginForm redirect={redirectPath}/>
			<div className="block mt-5 leading-snug">
				Don't have an account?
				<br/>
				<Link href={`/signup${getRedirectQueryForPage(redirectPath)}`}>
					Create one here
				</Link>
			</div>
		</MiddleIsland>
	);
}
