'use client';

import {ColourSchemeButton} from './colour-scheme-handler';
import {getRedirectQueryFromCurrentPage} from './utils/get-redirect';

import ArrowTopRightOnSquareIcon from '@heroicons/react/24/outline/ArrowTopRightOnSquareIcon';
import Bars3Icon from '@heroicons/react/24/outline/Bars3Icon';
import ChevronDownIcon from '@heroicons/react/24/outline/ChevronDownIcon';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import Image from 'next/image';
import {useState} from 'react';

import type {ColourScheme} from './../constants';
import type {ReactNode} from 'react';

interface LinkProps {
	name: string;
	href: string;
	border?: boolean;
	external?: boolean;
	hide?: 'mobile' | 'desktop';
	indent?: boolean;
}

function NavbarLink(props: LinkProps) {
	return (
		<a
			href={props.href}
			target={props.external ? '_blank' : undefined}
			className={`${props.border ? 'border-2 rounded-md border-current' : ''} ${props.hide === 'mobile' ? 'hidden sm:block' : ''} ${props.hide === 'desktop' ? 'block sm:hidden' : ''}`}
		>
			<NavbarElement indent={props.indent}>
				<div className="inline-flex items-baseline">
					{props.name}
					{props.external && (
						<ArrowTopRightOnSquareIcon className="self-center w-5 h-5 pl-1"/>
					)}
				</div>
			</NavbarElement>
		</a>
	);
}

interface ButtonProps {
	onClick: () => void;
	children: ReactNode;
	hide?: 'mobile' | 'desktop';
}

export function NavbarButton(props: ButtonProps) {
	return (
		<div tabIndex={0} onClick={props.onClick} className={`hover:cursor-pointer ${props.hide === 'mobile' ? 'hidden sm:block' : ''} ${props.hide === 'desktop' ? 'block sm:hidden' : ''}`}>
			<NavbarElement>
				{props.children}
			</NavbarElement>
		</div>
	);
}

function NavbarElement({children, indent}: {children: ReactNode, indent?: boolean}) {
	return (
		<div className={`rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 select-none ${indent ? 'ml-6' : ''}`}>
			{children}
		</div>
	);
}

export let changeUsername: (username: string) => void;
export let changeProfilePictureUrl: (username: string) => void;

interface Link {
	name: string;
	href: string;
	external?: boolean;
}

interface NavbarProps {
	colourScheme: ColourScheme;
	loggedIn: boolean;
	username?: string;
	profilePicture?: string;
}

export function NavbarContent({
	colourScheme,
	loggedIn,
	username: defaultUsername,
	profilePicture,
}: NavbarProps) {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [accountMenuOpen, setAccountMenuOpen] = useState(false);

	// Make some parts controlled by states so they can be editted on
	// the account page without force reloading
	const [username, setUsername] = useState(defaultUsername);
	changeUsername = setUsername;
	const [profilePictureUrl, setProfilePictureUrl] = useState(profilePicture);
	changeProfilePictureUrl = setProfilePictureUrl;

	const accountQueryString = getRedirectQueryFromCurrentPage();

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
			href: 'https://github.com/danielhoward-me/sso',
			external: true,
		},
	];

	return (
		<>
			<nav className="fixed left-0 right-0 top-0 z-30">
				<div className="shadow-lg dark:bg-gray-800 bg-white">
					<div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
						<div className="relative flex h-16 items-center justify-between">
							<div className="absolute left-0 flex items-center sm:hidden">
								<NavbarButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
									{mobileMenuOpen ? (
										<XMarkIcon className="w-6 h-6"/>
									) : (
										<Bars3Icon className="w-6 h-6"/>
									)}
								</NavbarButton>
							</div>
							<div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
								<div className="flex flex-shrink-0 items-center">
									<Image
										src="/static/img/icon.svg"
										alt="Accounts icon"
										width={32} height={36}
										className="dark:filter dark:invert select-none w-8 h-9"
									/>
								</div>
								<div className="hidden sm:ml-6 sm:block">
									<div className="flex space-x-4">
										{links.map((link) => (
											<NavbarLink key={link.href} {...link}/>
										))}
									</div>
								</div>
							</div>
							<div className="absolute right-0 flex flex-1 items-center space-x-2 sm:space-x-4">
								<ColourSchemeButton colourScheme={colourScheme}/>

								{loggedIn ? (
									<div className="relative">
										<NavbarButton onClick={() => setAccountMenuOpen(!accountMenuOpen)} hide="mobile">
											<div className="flex space-x-2 items-center">
												<Image className="rounded-full" width={25} height={25} alt="Account Profile Picture" src={profilePictureUrl || ''}/>
												<p>{username}</p>
												<ChevronDownIcon className={`self-center w-5 h-5 transition-transform ${accountMenuOpen ? 'rotate-180' : ''}`}/>
											</div>
										</NavbarButton>
										<div className={`hidden absolute right-0 mt-4 w-48 rounded-md shadow-lg p-2 bg-white dark:bg-gray-800 ${accountMenuOpen ? 'sm:block' : ''}`}>
											<NavbarLink name="Account" href="/account"/>
											<NavbarLink name="Log out" href="/logout"/>
										</div>
									</div>
								) : (
									<>
										<NavbarLink name="Log in" href={`/login${accountQueryString}`} hide="mobile"/>
										<NavbarLink name="Sign up" href={`/signup${accountQueryString}`} border hide="mobile"/>
									</>
								)}
							</div>
						</div>
					</div>

					<div className={`sm:hidden ${mobileMenuOpen ? '' : 'hidden '}`}>
						<div className="pb-3 pt-2 px-2 space-y-1">
							{links.map((link) => (
								<NavbarLink key={link.href} {...link}/>
							))}

							{loggedIn ? (
								<>
									<NavbarButton onClick={() => setAccountMenuOpen(!accountMenuOpen)}>
										<div className="flex space-x-2 items-center">
											<Image className="rounded-full" width={25} height={25} alt="Account Profile Picture" src={profilePictureUrl || ''}/>
											<p>{username}</p>
											<ChevronDownIcon className={`self-center w-5 h-5 transition-transform ${accountMenuOpen ? 'rotate-180' : ''}`}/>
										</div>
									</NavbarButton>
									{accountMenuOpen && (
										<>
											<NavbarLink name="Account" href="/account" indent/>
											<NavbarLink name="Log out" href="/logout" indent/>
										</>
									)}
								</>
							) : (
								[
									{
										name: 'Log in',
										href: `/login${accountQueryString}`,
									},
									{
										name: 'Sign up',
										href: `/signup${accountQueryString}`,
									},
								].map((link) => (
									<NavbarLink key={link.href} {...link}/>
								))
							)}
						</div>
					</div>
				</div>
			</nav>

			<div
				className={`fixed top-0 left-0 w-full h-full bg-black sm:bg-none bg-opacity-0 ${mobileMenuOpen ? 'bg-opacity-30' : ''} sm:bg-opacity-0 z-20 ${mobileMenuOpen || accountMenuOpen ? '' : 'pointer-events-none'}`}
				onClick={() => {
					setMobileMenuOpen(false);
					setAccountMenuOpen(false);
				}}
			/>
		</>
	);
}
