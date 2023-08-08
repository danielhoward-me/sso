import LoginPageSlug, {
	getServerSideProps as getServerSidePropsSlug,
} from './[slug]';

import type {pageProps} from './[slug]';
import type {GetServerSideProps} from 'next';

export default function LoginPage(props: pageProps) {
	return LoginPageSlug(props);
}

export const getServerSideProps: GetServerSideProps<pageProps> = getServerSidePropsSlug;
