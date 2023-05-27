import db from '../../lib/database';

import Head from 'next/head';

import type {LoginPage as LoginPageProps, LoginPages} from '../../types';
import type {GetServerSideProps} from 'next';

let pages: LoginPages;
const pagesPromise = db.getLoginPages().then((data) => (pages = data));

export default function LoginPage({pageData}: {pageData: LoginPageProps}) {
	const pageTitle = `${pageData.pageName ? `${pageData.pageName} ` : ''}Login`;
	return (
		<>
			<Head>
				<title>{pageTitle}</title>
				<meta name="description" content={pageTitle}/>
			</Head>
			<div>
				<h1>Login{pageData.pageName ? ` to ${pageData.pageName}` : ''}</h1>
			</div>
		</>
	);
}

export const getServerSideProps: GetServerSideProps<{
	pageData?: LoginPageProps;
}> = async ({req}) => {
	if (pages === undefined) await pagesPromise;

	const splitUrl = req.url?.split('/');
	const slug = splitUrl?.length === 3 ? splitUrl[2] : '';
	const pageData = pages[slug];

	if (pageData === undefined) {
		return {notFound: true};
	}

	return {props: {pageData}};
};
