import {DEFAULT_POST_LOGIN_REDIRECT, REDIRECT_QUERY_PARAMETER_NAME} from './../../constants';

import {redirect} from 'next/navigation';

export default function getRedirect(searchParams: {[key: string]: string | string[] | undefined}, pagePath: string): string {
	const redirectParam = searchParams[REDIRECT_QUERY_PARAMETER_NAME];

	// Ensure the redirect is internal
	if (typeof redirectParam !== 'string' || /^https?/.test(redirectParam)) {
		redirect(`/${pagePath}?${REDIRECT_QUERY_PARAMETER_NAME}=${encodeURIComponent(DEFAULT_POST_LOGIN_REDIRECT)}`);
	}

	return decodeURIComponent(redirectParam);
}
