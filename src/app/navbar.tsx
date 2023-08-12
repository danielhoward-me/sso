import {ColourScheme, CookieName, DEFAULT_COLOUR_SCHEME} from './../constants';
import {getSession} from './../server/session';
import {NavBarContent} from './navBarElements';

import {cookies as getCookies} from 'next/headers';

export default function NavBar() {
	return (
		<nav className="shadow-lg dark:bg-gray-800 bg-white">
			<NavBarContent
				colourScheme={getColourScheme()}
				session={getSession()}
			/>
		</nav>
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
