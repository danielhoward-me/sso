export enum CookieName {
	SESSION = '0',
	COLOUR_SCHEME = '1',
}
export const SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export enum ColourScheme {
	SYSTEM,
	LIGHT,
	DARK,
}
export const DEFAULT_COLOUR_SCHEME = ColourScheme.SYSTEM;
