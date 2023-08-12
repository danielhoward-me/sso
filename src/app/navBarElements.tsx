'use client';

import ArrowTopRightOnSquareIcon from '@heroicons/react/24/outline/ArrowTopRightOnSquareIcon';
import Link from 'next/link';

export interface LinkProps {
	name: string;
	href: string;
	external?: boolean;
}

export function NavBarLink(props: LinkProps) {
	return (
		<Link
			href={props.href}
			target={props.external ? '_blank' : undefined}
		>
			<NavBarElement>
				<div className="inline-flex items-baseline">
					{props.name}
					{props.external && (
						<ArrowTopRightOnSquareIcon className="self-center w-5 h-5 pl-1"/>
					)}
				</div>
			</NavBarElement>
		</Link>
	);
}

interface ButtonProps {
	onClick: () => void;
	children: React.ReactNode;
}

export function NavBarButton(props: ButtonProps) {
	return (
		<div onClick={props.onClick} className="hover:cursor-pointer">
			<NavBarElement>
				{props.children}
			</NavBarElement>
		</div>
	);
}

function NavBarElement({children}: {children: React.ReactNode}) {
	return (
		<div className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 select-none">
			{children}
		</div>
	);
}
