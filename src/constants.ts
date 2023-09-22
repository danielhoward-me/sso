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

export const REDIRECT_QUERY_PARAMETER_NAME = 'redirect';
export const DEFAULT_POST_LOGIN_REDIRECT = '/';

export const SIGNUP_PLACEHOLDER_USERNAMES = [
	'Rumpelstiltskin',
	'FashionForward',
	'NomNomNation',
	'RecipeRockstar',
	'TouristyTraveler',
	'TechyTechie',
	'FishFanatic',
];

// Should match schema.sql profile_picture
export enum ProfilePictureType {
	Custom = 'custom',
	Identicon = 'identicon',
	MonsterId = 'monsterid',
	Wavatar = 'wavatar',
	Retro = 'retro',
	Robohash = 'robohash',
}

export const hideNavbarPages: string[] = [
	'/auth',
];
