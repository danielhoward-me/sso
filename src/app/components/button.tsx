export default function button(props: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) {
	return (
		<button
			{...props}
			className={`${props.className ? props.className : ''} bg-blue-500 text-white font-bold py-2 px-4 rounded ring-0 ${props.disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'}`}
		>
			{props.children}
		</button>
	);
}
