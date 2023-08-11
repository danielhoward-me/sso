import './styles/tailwind.css';

import {loadSession} from './../server/session';
import NavBar from './navbar';

import type {Metadata} from 'next';

export const metadata: Metadata = {
	title: 'Account',
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
	children: React.ReactNode
}) {
	await loadSession();

	return (
		<html lang="en">
			<body className="dark:bg-gray-800 bg-white dark:text-white">
				<NavBar/>
				<main>
					{children}
				</main>
			</body>
		</html>
	);
}
