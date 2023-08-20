import LoadingSpinner from './loading-spinner';
import sanitiseProps from './sanitiseProps';

interface ButtonProps extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
	loading?: boolean;
}

export default function Button(props: ButtonProps) {
	const buttonProps = sanitiseProps(props, [
		'loading',
	]);

	return (
		<button
			{...buttonProps}
			className={`${props.className ? props.className : ''} bg-blue-500 text-white flex items-center font-bold py-2 px-4 rounded ring-0 ${props.disabled || props.loading ? 'cursor-not-allowed opacity-50' : 'hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'}`}
			disabled={props.disabled || props.loading}
		>
			<LoadingSpinner visible={props.loading}/>
			{props.children}
		</button>
	);
}
