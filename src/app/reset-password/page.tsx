import {getSession} from './../../server/session';
import User from './../../server/user';
import MiddleIsland from './../components/middle-island';
import EmailForm from './email-form';
import PasswordForm from './password-form';

import {redirect} from 'next/navigation';

import type {SearchParamsProps} from './../types.d';
import type {Metadata} from 'next';

export const metadata: Metadata = {
	title: 'Reset Your Password',
	description: 'Reset Your Password to access and save your data across all of my services',
};

export default async function ResetPasswordPage({searchParams}: SearchParamsProps) {
	const session = getSession();
	if (session.user || session.waitForAuthUser) {
		redirect('/');
	}

	const tokenGiven = typeof searchParams.token === 'string';

	if (tokenGiven) {
		const token = searchParams.token as string;
		const user = await User.getUserWithPasswordResetToken(token);

		if (!user) {
			redirect('/reset-password');
		}
	}

	return (
		<MiddleIsland>
			<h1 className="text-6xl font-bold pb-2">Reset Your Password</h1>
			{
				tokenGiven ? (
					<PasswordForm token={searchParams.token as string}/>
				) : (
					<EmailForm/>
				)
			}
		</MiddleIsland>
	);
}
