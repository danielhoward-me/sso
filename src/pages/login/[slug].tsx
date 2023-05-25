import {pages} from './../../constants';

import Head from 'next/head';

import type {LoginPage as LoginPageProps} from './../../types.d';
import type {GetStaticPaths, GetStaticProps} from 'next';

export default function LoginPag(pageData: LoginPageProps) {
	const pageTitle = `${pageData.pageName} Login`;
	return (
		<>
			<Head>
				<title>{pageTitle}</title>
				<meta name="description" content={pageTitle}/>
			</Head>
			<div>
				<h1>Login for {pageData.pageName}</h1>
			</div>
		</>
	);
}

export const getStaticPaths: GetStaticPaths = async () => {
	const slugs = Object.keys(pages);
	return {
		paths: slugs.map((slug) => ({params: {slug}})),
		fallback: 'blocking',
	};
};

export const getStaticProps: GetStaticProps = async ({params}) => {
	const slug = params.slug as string;
	const pageData = pages[slug];
	return {
		props: pageData,
	};
};
