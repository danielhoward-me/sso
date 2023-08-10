
import {ArrowTopRightOnSquareIcon} from '@heroicons/react/24/solid';
import Image from 'next/image';
import Link from 'next/link';

import type {Session} from './../constants/session';

interface Props {
	session: Session;
}

export default function NavBar({session}: Props) {
	const links: NavBarLinkProps[] = [
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
								{links.map(NavBarLink)}
							</div>
						</div>
					</div>
					<div className="hidden sm:flex flex-1 justify-end">
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

interface NavBarLinkProps {
	name: string;
	href: string;
	external?: boolean;
}

function NavBarLink(link: NavBarLinkProps) {
	return (
		<Link
			href={link.href}
			key={link.href}
			target={link.external ? '_blank' : undefined}
			className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
		>
			<div className="inline-flex items-baseline">
				{link.name}
				{link.external && (
					<ArrowTopRightOnSquareIcon className="self-center w-5 h-5 pl-1"/>
				)}
			</div>
		</Link>
	);
}
