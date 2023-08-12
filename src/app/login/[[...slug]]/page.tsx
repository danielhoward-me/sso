import loginPages from './../../../server/login-pages/pages';
import {getSession} from './../../../server/session';
import Link from './../../components/link';
import LoginForm from './form';

import {notFound} from 'next/navigation';

import type {Metadata} from 'next';

export interface Props {
	params: {
		slug: string[],
	}
}

export default function LoginPage({params}: Props) {
	const session = getSession();

	const slug = params?.slug?.[0] || '';
	const pageData = loginPages[slug];
	if (!pageData) return notFound();

	if (session.user) {
		pageData.onSuccessfulLogin();
		return;
	}

	const pageName = pageData.name;

	return (
		<div className="flex justify-center items-center min-h-[var(--real-page-height)]">
			<div className="text-center m-4">
				<div className="bg-white dark:bg-gray-800 rounded-lg p-10 shadow-md">
					<h1 className="text-6xl font-bold pb-2">Log in to {pageName}</h1>
					<LoginForm/>
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

export function generateMetadata({params}: Props): Metadata {
	const slug = params?.slug?.[0] || '';
	const pageData = loginPages[slug];

	const pageTitle = `Log in to ${pageData.name}`;

	return {
		title: pageTitle,
		description: pageTitle,
	};
}
