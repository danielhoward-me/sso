import loginPages from './../../constants/loginTargets';
import getSession from './../../server/session';

import Head from 'next/head';

import type {LoginPage as LoginPageProps} from './../../constants/loginTargets';
import type {Session} from './../../constants/session';
import type {GetServerSideProps} from 'next';

interface pageProps {
	pageData: LoginPageProps;
	session: Session;
}

export default function LoginPage({pageData, session}: pageProps) {
	const pageTitle = `${pageData.pageName ? `${pageData.pageName} ` : ''}Login`;
	return (
		<>
			<Head>
				<title>{pageTitle}</title>
				<meta name="description" content={pageTitle}/>
			</Head>
			<div>
				<h1>Login{pageData.pageName ? ` to ${pageData.pageName}` : ''}</h1>
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

	return {props: {pageData, session}};
};
