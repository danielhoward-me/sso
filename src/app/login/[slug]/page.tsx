import loginPages from './../../../server/login-pages/pages';
import {getSession} from './../../../server/session';

import Head from 'next/head';
import {notFound} from 'next/navigation';

export interface Props {
	params: {
		slug: string,
	}
}

export default function LoginPage({params}: Props) {
	const session = getSession();

	const slug = params?.slug || '';
	const pageData = loginPages[slug];
	if (!pageData) return notFound();

	if (session.user) {
		pageData.onSuccessfulLogin();
		return;
	}

	const pageName = pageData.name;
	const pageTitle = `${pageName ? `${pageName} ` : ''}Login`;

	return (
		<>
			<Head>
				<title>{pageTitle}</title>
				<meta name="description" content={pageTitle}/>
			</Head>
			<div>
				<h1>Login{pageName ? ` to ${pageName}` : ''}</h1>
				{JSON.stringify(session)}
			</div>
		</>
	);
}
