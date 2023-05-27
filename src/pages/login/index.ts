import LoginPageSlug, {getServerSideProps as getServerSidePropsSlug} from './[slug]';

import type {LoginPage as LoginPageProps} from '../../types';
import type {GetServerSideProps} from 'next';

export default function LoginPage(props: {pageData: LoginPageProps}) {
	return LoginPageSlug(props);
}

export const getServerSideProps: GetServerSideProps<{
	pageData?: LoginPageProps;
}> = getServerSidePropsSlug;
