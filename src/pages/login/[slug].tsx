import db from '../../lib/database';

import Head from 'next/head';

import type {LoginPage as LoginPageProps, LoginPages} from './../../types.d';
import type {GetServerSideProps} from 'next';

let pages: LoginPages;
const pagesPromise = db.getLoginPages().then((data) => (pages = data));

export default function LoginPage(pageData: LoginPageProps) {
	const pageTitle = `${pageData.pageName} Login`;
	return (
		<>
			<Head>
				<title>{pageTitle}</title>
				<meta name="description" content={pageTitle}/>
			</Head>
			<div>
				<h1>Login to {pageData.pageName}</h1>
			</div>
		</>
	);
}

export const getServerSideProps: GetServerSideProps<{
	pageData?: LoginPageProps;
}> = async ({req, res}) => {
	if (pages === undefined) await pagesPromise;

	const slug = req.url?.split('/').pop() || '';
	const pageData = pages[slug];

	if (pageData === undefined) {
		res.statusCode = 404;
		return {props: {}};
	}

	return {props: {pageData}};
};
