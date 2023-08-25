import './../styles/tailwind.css';
import ModalHandler from './modal-handler';
import Navbar, {shouldBeDark} from './navbar';

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
	children: JSX.Element
}) {
	return (
		<html lang="en" className={shouldBeDark() ? 'dark' : ''}>
			<body className="dark:bg-gray-800 dark:bg-opacity-95 dark:text-white bg-gray-100">
				<ModalHandler/>
				<Navbar/>
				<main className="translate-y-16">
					{children}
				</main>
			</body>
		</html>
	);
}
