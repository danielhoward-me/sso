import './../styles/tailwind.css';

import Navbar, {shouldBeDark} from './navbar';

import {headers} from 'next/headers';

import type {Metadata} from 'next';

export const metadata: Metadata = {
	title: 'Accounts',
	description: 'Accounts system for danielhoward.me',
	icons: {
		icon: [
			{
				sizes: '32x32',
				url: '/favicon-32x32.png',
			},
			{
				sizes: '64x64',
				url: '/favicon-64x64.png',
			},
		],
		apple: '/apple-touch-icon.png',
	},
};

export default async function RootLayout({
	children,
}: {
	children: JSX.Element,
}) {
	const hideNavbar = headers().get('x-hide-navbar') === '1';

	return (
		<html lang="en" className={shouldBeDark() ? 'dark' : ''}>
			<body className="dark:bg-gray-800 dark:bg-opacity-95 dark:text-white bg-gray-100">
				<div id="modal"/>
				{!hideNavbar && <Navbar/>}
				<main
					style={{'--real-page-height': `calc(100vh ${hideNavbar ? '' : '- 4rem'})`} as React.CSSProperties}
					className={hideNavbar ? '' : 'translate-y-16'}
				>
					{children}
				</main>
			</body>
		</html>
	);
}
