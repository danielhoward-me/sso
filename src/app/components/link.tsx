interface LinkProps {
	href: string;
	children: React.ReactNode;
}

export default function Link(props: LinkProps) {
	return (
		<a
			href={props.href}
			className="text-blue-500 hover:underline"
		>
			{props.children}
		</a>
	);
}
