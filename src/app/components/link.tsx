import NextLink from 'next/link';

interface LinkProps {
	href: string;
	children: React.ReactNode;
}

export default function Link(props: LinkProps) {
	return (
		<NextLink
			href={props.href}
			className="text-blue-500 hover:underline"
		>
			{props.children}
		</NextLink>
	);
}
