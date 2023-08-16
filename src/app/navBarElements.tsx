'use client';

import {ColourSchemeButton} from './colourSchemeHandler';

import ArrowTopRightOnSquareIcon from '@heroicons/react/24/outline/ArrowTopRightOnSquareIcon';
import Bars3Icon from '@heroicons/react/24/outline/Bars3Icon';
import ChevronDownIcon from '@heroicons/react/24/outline/ChevronDownIcon';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import Image from 'next/image';
import {useState} from 'react';

import type {ColourScheme} from './../constants';

export interface LinkProps {
	name: string;
	href: string;
	border?: boolean;
	external?: boolean;
	hide?: 'mobile' | 'desktop';
	indent?: boolean;
}

export function NavBarLink(props: LinkProps) {
	return (
		<a
			href={props.href}
			target={props.external ? '_blank' : undefined}
			className={`${props.border ? 'border-2 rounded-md border-current' : ''} ${props.hide === 'mobile' ? 'hidden sm:block' : ''} ${props.hide === 'desktop' ? 'block sm:hidden' : ''}`}
		>
			<NavBarElement indent={props.indent}>
				<div className="inline-flex items-baseline">
					{props.name}
					{props.external && (
						<ArrowTopRightOnSquareIcon className="self-center w-5 h-5 pl-1"/>
					)}
				</div>
			</NavBarElement>
		</a>
	);
}

interface ButtonProps {
	onClick: () => void;
	children: React.ReactNode;
	hide?: 'mobile' | 'desktop';
}

export function NavBarButton(props: ButtonProps) {
	return (
		<div tabIndex={0} onClick={props.onClick} className={`hover:cursor-pointer ${props.hide === 'mobile' ? 'hidden sm:block' : ''} ${props.hide === 'desktop' ? 'block sm:hidden' : ''}`}>
			<NavBarElement>
				{props.children}
			</NavBarElement>
		</div>
	);
}

function NavBarElement({children, indent}: {children: React.ReactNode, indent?: boolean}) {
	return (
		<div className={`rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 select-none ${indent ? 'ml-6' : ''}`}>
			{children}
		</div>
	);
}

interface Link {
	name: string;
	href: string;
	external?: boolean;
}

interface NavBarProps {
	colourScheme: ColourScheme;
	loggedIn: boolean;
	username?: string;
	profilePicture?: string;
}

export function NavBarContent({
	colourScheme,
	loggedIn,
	username,
	profilePicture,
}: NavBarProps) {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [accountMenuOpen, setAccountMenuOpen] = useState(false);

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
		<>
			<nav className="fixed left-0 right-0 top-0 z-50">
				<div className="shadow-lg dark:bg-gray-800 bg-white">
					<div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
						<div className="relative flex h-16 items-center justify-between">
							<div className="absolute left-0 flex items-center sm:hidden">
								<NavBarButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
									<Bars3Icon className={`w-6 h-6 ${mobileMenuOpen ? 'hidden' : ''}`}/>
									<XMarkIcon className={`w-6 h-6 ${mobileMenuOpen ? '' : 'hidden'}`}/>
								</NavBarButton>
							</div>
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
							<div className="absolute right-0 flex flex-1 items-center space-x-2 sm:space-x-4">
								<ColourSchemeButton colourScheme={colourScheme}/>

								{loggedIn ? (
									<div className="relative">
										<NavBarButton onClick={() => setAccountMenuOpen(!accountMenuOpen)} hide="mobile">
											<div className="flex space-x-2 items-center">
												<Image className="rounded-full" width={25} height={25} alt="Account Profile Picture" src={profilePicture || ''}/>
												<p>{username}</p>
												<ChevronDownIcon className={`self-center w-5 h-5 ${accountMenuOpen ? 'rotate-180' : ''}`}/>
											</div>
										</NavBarButton>
										<div className={`hidden absolute right-0 mt-4 w-48 rounded-md shadow-lg p-2 bg-white dark:bg-gray-800 ${accountMenuOpen ? 'sm:block' : ''}`}>
											<NavBarLink name="Account" href="/account"/>
											<NavBarLink name="Log out" href="/logout"/>
										</div>
									</div>
								) : (
									<>
										<NavBarLink name="Log in" href="/login" hide="mobile"/>
										<NavBarLink name="Sign up" href="/signup" border hide="mobile"/>
									</>
								)}
							</div>
						</div>
					</div>

					<div className={`sm:hidden ${mobileMenuOpen ? '' : 'hidden '}`}>
						<div className="pb-3 pt-2 px-2 space-y-1">
							{links.map((link) => (
								<NavBarLink key={link.href} {...link}/>
							))}

							{loggedIn ? (
								<>
									<NavBarButton onClick={() => setAccountMenuOpen(!accountMenuOpen)}>
										<div className="flex space-x-2 items-center">
											<Image className="rounded-full" width={25} height={25} alt="Account Profile Picture" src={profilePicture || ''}/>
											<p>{username}</p>
											<ChevronDownIcon className={`self-center w-5 h-5 ${accountMenuOpen ? 'rotate-180' : ''}`}/>
										</div>
									</NavBarButton>
									{accountMenuOpen && (
										<>
											<NavBarLink name="Account" href="/account" indent/>
											<NavBarLink name="Log out" href="/logout" indent/>
										</>
									)}
								</>
							) : (
								[
									{
										name: 'Log in',
										href: '/login',
									},
									{
										name: 'Sign up',
										href: '/signup',
									},
								].map((link) => (
									<NavBarLink key={link.href} {...link}/>
								))
							)}
						</div>
					</div>
				</div>
			</nav>

			<div
				className={`fixed top-0 left-0 w-full h-full bg-black sm:bg-none bg-opacity-0 ${mobileMenuOpen ? 'bg-opacity-30' : ''} sm:bg-opacity-0 z-10 pointer-events-none ${mobileMenuOpen || accountMenuOpen ? 'pointer-events-auto' : ''}`}
				onClick={() => {
					setMobileMenuOpen(false);
					setAccountMenuOpen(false);
				}}
			/>
		</>
	);
}
