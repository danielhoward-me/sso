import {ColourScheme, CookieName, DEFAULT_COLOUR_SCHEME} from './../constants';
import {getSession} from './../server/session';
import {NavbarContent} from './navbar-elements';

import {cookies as getCookies} from 'next/headers';

export default function Navbar() {
	const session = getSession();
	return (
		<NavbarContent
			colourScheme={getColourScheme()}
			loggedIn={session.user !== null}
			username={session.user?.username}
			profilePicture={session.user?.getProfilePictureUrl()}
		/>
	);
}

function getColourScheme(): ColourScheme {
	const cookies = getCookies();
	const colourSchemeCookie = parseInt(cookies.get(CookieName.COLOUR_SCHEME)?.value ?? '-1');
	return colourSchemeCookie in ColourScheme ? colourSchemeCookie : DEFAULT_COLOUR_SCHEME;
}

export function shouldBeDark(): boolean {
	const cookies = getCookies();
	const colourScheme = getColourScheme();

	return colourScheme === ColourScheme.DARK || (
		colourScheme === ColourScheme.BROWSER && cookies.get(CookieName.BROWSER_PREFERED_SCHEME)?.value === ColourScheme.DARK.toString()
	);
}
