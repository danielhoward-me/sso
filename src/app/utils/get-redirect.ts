import {DEFAULT_POST_LOGIN_REDIRECT, REDIRECT_QUERY_PARAMETER_NAME} from './../../constants';

import {redirect, usePathname, useSearchParams} from 'next/navigation';

import type {SearchParamsProps} from './../types.d';

export function getRedirect(searchParams: SearchParamsProps['searchParams'], pagePath: string): string {
	const redirectParam = searchParams[REDIRECT_QUERY_PARAMETER_NAME];

	// Ensure the redirect is internal
	if (typeof redirectParam !== 'string' || /^(https?|\/\/)/.test(redirectParam)) {
		redirect(`${pagePath}${getRedirectQueryForPage(DEFAULT_POST_LOGIN_REDIRECT)}`);
	}

	return decodeURIComponent(redirectParam);
}

export function getRedirectQueryFromCurrentPage(): string {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	if (/\/(login|signup|confirm-email)/.test(pathname)) {
		const currentRedirect = searchParams.get(REDIRECT_QUERY_PARAMETER_NAME);
		return getRedirectQueryForPage(decodeURIComponent(currentRedirect || DEFAULT_POST_LOGIN_REDIRECT));
	}

	const fullPath = `${usePathname()}${Array.from(searchParams.keys()).length === 0 ? '' : '?'}${searchParams.toString()}`;
	return getRedirectQueryForPage(fullPath);
}

export function getRedirectQueryForPage(page: string): string {
	return `?${REDIRECT_QUERY_PARAMETER_NAME}=${encodeURIComponent(page)}`;
}
