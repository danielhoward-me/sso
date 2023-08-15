export enum CookieName {
	SESSION = '0',
	COLOUR_SCHEME = '1',
	BROWSER_PREFERED_SCHEME = '2',
}
export const SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export enum ColourScheme {
	BROWSER,
	LIGHT,
	DARK,
}
export const DEFAULT_COLOUR_SCHEME = ColourScheme.BROWSER;

export const DEFAULT_POST_LOGIN_REDIRECT = '/';
