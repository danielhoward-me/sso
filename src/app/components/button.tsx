interface ButtonProps {
	type: 'button' | 'submit';
	onClick?: () => void;
	children: React.ReactNode;
}

export default function button(props: ButtonProps) {
	return (
		<button
			className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ring-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
			onClick={props.onClick}
			type={props.type}
		>
			{props.children}
		</button>
	);
}
