import loginPages from './../../server/login-pages/pages';
import getSession from './../../server/session';

import Head from 'next/head';

import type {Session} from './../../constants/session';
import type {GetServerSideProps} from 'next';

export interface pageProps {
	pageName: string;
	session: Session;
}

export default function LoginPage({pageName, session}: pageProps) {
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

export const getServerSideProps: GetServerSideProps<pageProps> = async ({req, res}) => {
	const splitUrl = req.url?.split('/');
	const slug = splitUrl?.length === 3 ? splitUrl[2] : '';
	const pageData = loginPages[slug];

	if (pageData === undefined) {
		return {notFound: true};
	}

	const session = await getSession(req, res);

	if (session.userId !== null) {
		pageData.onSuccessfulLogin();
		return {redirect: {destination: '/', permanent: false}};
	}

	return {props: {pageName: pageData.name, session}};
};
