import {ColourScheme, CookieName, DEFAULT_COLOUR_SCHEME} from './../constants';
import {getSession} from './../server/session';
import {ColourSchemeButton} from './colourSchemeHandler';
import {NavBarLink} from './navBarElements';

import {cookies as getCookies} from 'next/headers';
import Image from 'next/image';

interface Link {
	name: string;
	href: string;
	external?: boolean;
}

export default function NavBar() {
	const session = getSession();

	const links: Link[] = [
		{
			name: 'Home',
			href: '/',
		},
		{
			name: 'About',
			href: '/about',
		},
		{
			name: 'GitHub',
			href: 'https://github.com/danielhoward-me/account',
			external: true,
		},
	];

	return (
		<nav className="shadow">
			<div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
				<div className="relative flex h-16 items-center justify-between">
					<div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
						<div className="flex flex-shrink-0 items-center">
							<Image
								src="/static/img/icon.svg"
								alt="Accounts icon"
								width={32} height={32}
								className="dark:filter dark:invert"
							/>
						</div>
						<div className="hidden sm:ml-6 sm:block">
							<div className="flex space-x-4">
								{links.map((link) => (
									<NavBarLink key={link.href} {...link}/>
								))}
							</div>
						</div>
					</div>
					<div className="hidden sm:flex flex-1 justify-end">
						<ColourSchemeButton colourScheme={getColourScheme()}/>

						{session?.user ? (
							<NavBarLink name="Log out" href="/api/logout"/>
						) : (
							<NavBarLink name="Log in" href="/login"/>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
}

export function getColourScheme(): ColourScheme {
	const cookies = getCookies();
	const colourSchemeCookie = parseInt(cookies.get(CookieName.COLOUR_SCHEME)?.value ?? '-1');
	return colourSchemeCookie in ColourScheme ? colourSchemeCookie : DEFAULT_COLOUR_SCHEME;
}
