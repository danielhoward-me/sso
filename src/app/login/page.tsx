import {getSession} from './../../server/session';
import Link from './../components/link';
import getRedirect from './../utils/getRedirect';
import LoginForm from './form';

import {redirect} from 'next/navigation';

import type {Metadata} from 'next';

export const metadata: Metadata = {
	title: 'Log in to Your Account',
	description: 'Log in to your account to access and save your data across all of my services',
};

interface Props {
	searchParams: {
		[key: string]: string | string[] | undefined,
	};
}

export default function LoginPage({searchParams}: Props) {
	const session = getSession();

	const redirectPath = getRedirect(searchParams, '/login');

	if (session.user) {
		redirect(redirectPath);
	}

	return (
		<div className="flex justify-center items-center min-h-[var(--real-page-height)]">
			<div className="text-center m-4">
				<div className="bg-white dark:bg-gray-800 rounded-lg p-10 shadow-md">
					<h1 className="text-6xl font-bold pb-2">Log in to Your Account</h1>
					<LoginForm redirect={redirectPath}/>
					<div className="block mt-5 leading-snug">
						Don't have an account?
						<br/>
						<Link href="/signup">
							Create one here
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
