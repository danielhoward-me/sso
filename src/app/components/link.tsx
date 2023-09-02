import sanitiseProps from './../utils/sanitise-props';

import type {DetailedHTMLProps, AnchorHTMLAttributes, ReactNode} from 'react';

interface LinkProps extends DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> {
	children: ReactNode;
}

export default function Link(props: LinkProps) {
	const linkProps = sanitiseProps(props, [
		'children',
	]);

	return (
		<a
			{...linkProps}
			className="text-blue-500 hover:underline"
		>
			{props.children}
		</a>
	);
}
