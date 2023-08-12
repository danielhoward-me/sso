import './../styles/tailwind.css';

import NavBar, {shouldBeDark} from './navBar';

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
	return (
		<html lang="en" className={shouldBeDark() ? 'dark' : ''}>
			<body className="dark:bg-gray-800 dark:text-white bg-white">
				<NavBar/>
				<main>
					{children}
				</main>
			</body>
		</html>
	);
}
